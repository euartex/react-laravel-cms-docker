<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Nicolaslopezj\Searchable\SearchableTrait;

class Company extends Model
{
    use SearchableTrait;

    protected $hidden = [];

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

    public function assets()
    {
        return $this->hasMany('\App\Asset');
    }

    protected $with = ['meta_tags'];

    protected $fillable = ['name','company_id','address','country','phone','email','zip','auto_published', 'is_auto_assign_top_news_tag'];

    public function meta_tags()
    {
        return $this->belongsToMany('\App\Tag');
    }


    /**
    *   Scope for listing load
    *   @param \Illuminate\Database\Eloquent\Builder $query
    *   @return \Illuminate\Database\Eloquent\Builder $query
    */
    public function scopeListSelect($query)
    {
        return $query->without(['meta_tags'])->selectRaw('id, name');
    }


    /**
    *   Scope: Get company by playlist top status
    *   
    *   @param $query
    *   @return $query
    */
    public function scopeGetTopPlaylistCompany($query){

        return $query->whereHas('assets', function ($query) {
            $query->whereHas('playlist', function ($query) {
                $query->whereIsTop(true);
            });
        });
    }
}
