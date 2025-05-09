<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Nicolaslopezj\Searchable\SearchableTrait;
use Illuminate\Database\Eloquent\Builder;

class Tag extends Model
{
	use SearchableTrait;

    /**
    *   Custom model error
    */
    public $error;

    protected $with = ['meta'];

    protected $hidden = ['pivot'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'is_asset_pl_add_sort_by_id',
        'is_top_news_tag'
    ];

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
            'title' => 10,
        ],
    ];

    public function meta(){

        return $this->belongsToMany('\App\Metadata')->without('tags');
    }

    /**
     *   Scope for listing load
     *   @param \Illuminate\Database\Eloquent\Builder $query
     *   @param $limited boolean
     *   @return \Illuminate\Database\Eloquent\Builder $query
     */
    public function scopeListSelect($query, $limited)
    {
        if($limited === true) {
            return $query->without(['meta'])->selectRaw('id, title');
        }

        return $query;
    }
}
