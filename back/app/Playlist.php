<?php

namespace App;

use App\Traits\CallbackCacheTrait;
use App\Traits\ClearHistory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Nicolaslopezj\Searchable\SearchableTrait;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use App\Traits\BelongsToSortedManyCustomTrait;
use Panoscape\History\HasHistories;
use App\Traits\HasPivotForHistory;
use App\Traits\HasCache;
use App\Enums\StatusAsset;


class Playlist extends Model
{

    use  SearchableTrait, SoftDeletes, HasSlug, BelongsToSortedManyCustomTrait, HasHistories, HasPivotForHistory, ClearHistory, CallbackCacheTrait, HasCache;


    protected $with = ['meta_tags', 'poster', 'cover', 'assets'];

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
            'description' => 5
        ],
    ];


    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug')
            ->doNotGenerateSlugsOnUpdate();
    }

    public $casts = [
        'is_top' => 'boolean',
    ];

    protected $hidden = ['tags', 'project_id', 'poster_id', 'cover_id'];

    protected $fillable = ['name', 'description', 'project_id', 'is_top','slug'];

    public function getModelLabel()
    {
        return $this->display_name;
    }

    public function assets()
    {
        return $this->belongsToSortedManyCustom('\App\Asset', 'order')->where('status', '!=', StatusAsset::WpAutoDraft)->withPivot('order')->orderBy('order');
    }

    public function poster()
    {
        return $this->belongsTo('\App\Upload', 'poster_id', 'id');
    }

    public function project()
    {
        return $this->belongsTo('\App\Project');
    }

    public function cover()
    {
        return $this->belongsTo('\App\Upload', 'cover_id', 'id');
    }

    public function meta_tags()
    {
        return $this->belongsToMany('\App\Tag');
    }

    public function navigations()
    {
        return $this->belongsToMany('\App\Navigation');
    }

    /**
     *   Scope for listing load
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param $limited boolean
     * @return \Illuminate\Database\Eloquent\Builder $query
     */
    public function scopeListSelect($query, $limited)
    {
        if ($limited === true)
            return $query->without(['meta_tags', 'assets', 'cover', 'poster'])->selectRaw('id, name');

        return $query->without(['meta_tags', 'assets', 'cover', 'poster'])->selectRaw('id, created_at, name, description, is_top');
    }

    /**
     *   Unset  mark is_top  for old playlist
     *
     * @param $query
     * @return boolean
     */
    public function scopeUnsetPreviousTopMark($query)
    {

        if ($top_pl = $query->whereIsTop(true)->where('id', '!=', $this->id)->first()) {

            $top_pl->is_top = false;

            return $top_pl->save();
        }

        return false;
    }
}
