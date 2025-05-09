<?php

namespace App;

use App\Traits\CallbackCacheTrait;
use Illuminate\Database\Eloquent\Model;
use Nicolaslopezj\Searchable\SearchableTrait;
use Rutorika\Sortable\SortableTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

class Banner extends Model
{
    use SearchableTrait, SortableTrait, SoftDeletes, CallbackCacheTrait;

    protected static $sortableField = 'order';
    protected $softDelete = true;
    protected $hidden = ['image', 'deleted_at'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'project_id', 'timeout'
    ];

    protected $with = ['project','img'];


    public function project(){
        return $this->belongsTo('\App\Project');
    }

    public function img(){
        return $this->belongsTo('\App\Upload', 'image');
    }

    /**
     * Searchable rules.
     *
     * @var array
     */
    protected $searchable = [
        /**
         * Columns and their priority in search results.
         * Columns with higher values are more important.
         * Columns with equal values have equal importance.
         *
         * @var array
         */
        'columns' => [
            'name' => 10,
        ],
    ];

    /**
     * Scope a query to sorting banners by last banner which will be showed
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  mixed  $type
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeLastWillShowed($query)
    {
        return $query->orderByDesc('expiration_at')->orderBy('order');
    }

    /**
     * Scope a query to sorting banners by next banner which will be showed
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  mixed  $type
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeNextWillShowed($query)
    {
        return $query->orderBy('expiration_at')->orderBy('order');
    }

    /**
    *   Set new actual banner
    *
    *  @return false or modified Banner object
    */
    public function setNewShowBanner($time_unit = 'minutes'){

        if($banner = self::select('id','timeout','expiration_at')->nextWillShowed()->first()){

            $banner->expiration_at = now()->add($banner->timeout, $time_unit);

            return $banner;
        }

        return false;
    }

    /**
    *   Set new actual banner
    *
    *   @return false or modified Banner object
    */
    public function addNewBannerToQueue($time_unit = 'minutes'){

        if($lst_bnr = self::select('id', 'expiration_at')->lastWillShowed()->first()){

            //If 2, 3,...
            $this->expiration_at = Carbon::createFromTimestamp(strtotime($lst_bnr->expiration_at))->add($this->timeout, $time_unit);
        }else{

            //If first banner
            $this->expiration_at = now()->add($this->timeout, $time_unit);
        }

        return $this;
    }

    /**
    *   Set new show date for all banners
    *
    *   @return bool
    */
    public function resetEndDateForAllBannersSinceThisOrderValue(){

        $this->expiration_at = Carbon::createFromTimestamp(0);

        return self::where('order', '>=', $drty['order'] ?? $this->order)->update(['expiration_at' => $this->expiration_at]);
    }
}
