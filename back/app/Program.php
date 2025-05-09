<?php

namespace App;

use App\Traits\CallbackCacheTrait;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Nicolaslopezj\Searchable\SearchableTrait;
use App\Traits\HasCache;

class Program extends Model
{
    use SearchableTrait, HasCache, CallbackCacheTrait;

    public $timestamps = false;


    /**
    * This is a recommended way to declare event handlers
    */
    public static function boot() {

        parent::boot();

        static::deleting(function($program) {

            /**
            *   Show deleting before program will be deleted
            */
            $program->show()->delete();
        });
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
            'name' => 10
        ],
    ];

    protected $hidden = ['show_id','project_id'];

    protected $fillable = ['name','project_id','show_id','start_show_at','end_show_at','type'];

    //protected $appends = ['duration'];

    public function project()
    {
        return $this->belongsTo('\App\Project');
    }

    public function show()
    {
        return $this->belongsTo('\App\Show');
    }

     /**
     * Scope a query for  result sort
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeMultisort(Builder $query, string $fields, $direction = 'DESC')
    {

        foreach (explode(',', $fields) as $field) $query->orderBy($field, $direction);

        return $query;
    }

    public function getTableColumns()
    {
        return $this->getConnection()->getSchemaBuilder()->getColumnListing($this->getTable());
    }

    /*public function getDurationAttribute()
    {
        if($this->date && $this->start_show_at && $this->end_show_at) {
            $start = Carbon::parse($this->date . $this->start_show_at); // Add date to avoid errors with next day
            $end = Carbon::parse($this->date . $this->end_show_at);  // Add date to avoid errors with next day

            return $start->diff($end)->format('%H:%I');
        }

        return null;
    }*/
}
