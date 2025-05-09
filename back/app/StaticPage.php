<?php

namespace App;

use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Database\Eloquent\Model;
use Nicolaslopezj\Searchable\SearchableTrait;
use Rutorika\Sortable\SortableTrait;
use App\Traits\HasCache;
use App\Traits\CallbackCacheTrait;

class StaticPage extends Model
{
    use HasSlug, SearchableTrait, SortableTrait, HasCache, CallbackCacheTrait;


    protected static $sortableField = 'order';


    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions() : SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 'sub_title', 'html_content', 'project_id', 'type'
    ];


    protected $with = ['project'];


    public function project(){
        return $this->belongsTo('\App\Project');
    }


    /**
    *   Scope for listing load
    *   @param \Illuminate\Database\Eloquent\Builder $query
    *   @return \Illuminate\Database\Eloquent\Builder $query
    */
    public function scopeListSelect($query)
    {
        return $query->without(['project'])->selectRaw('id, title, sub_title');
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
            'title' => 10,
            'html_content' => 5
        ],
    ];

}
