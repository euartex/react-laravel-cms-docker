<?php

namespace App;

use App\Traits\CallbackCacheTrait;
use App\Traits\ClearHistory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Nicolaslopezj\Searchable\SearchableTrait;
use App\Traits\BelongsToSortedManyCustomTrait;
use Panoscape\History\HasHistories;
use App\Traits\HasPivotForHistory;
use App\Traits\HasCache;
use Rutorika\Sortable\SortableTrait;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Navigation extends Model
{

    use SortableTrait, BelongsToSortedManyCustomTrait, SearchableTrait, HasSlug, SoftDeletes, HasHistories, HasPivotForHistory, HasCache, CallbackCacheTrait, ClearHistory;

    protected static $sortableField = 'order';
    protected $softDelete = true;

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
            'cms_title' => 10,
            'description' => 5,
        ],
    ];

    protected $fillable = ['title','cms_title','description','type_id','project_id','seo_title','seo_description'];

    protected $with = ['type'];

    public $casts = [
        'type_id' => 'integer',
        'project_id' => 'integer',
    ];

    public function getModelLabel()
    {
        return $this->display_name;
    }

    public function project(){
        return $this->belongsTo('\App\Project');
    }

    public function type(){
        return $this->belongsTo('\App\NavigationType');
    }

    public function deviceTypes() {
        return $this->belongsToMany('\App\DeviceType','navigation_device_type');
    }

    public function playlists(){
        return $this->belongsToSortedManyCustom('\App\Playlist','order');
    }


    /**
    *   Scope for listing load
    *   @param \Illuminate\Database\Eloquent\Builder $query
    *   @return \Illuminate\Database\Eloquent\Builder $query
    */
    public function scopeListSelect($query)
    {
        return $query->selectRaw('id, title')->without(['type']);
    }
}
