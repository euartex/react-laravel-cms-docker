<?php

namespace App;

use App\Traits\CallbackCacheTrait;
use Illuminate\Database\Eloquent\Model;
use Nicolaslopezj\Searchable\SearchableTrait;
use \Illuminate\Database\Eloquent\Builder;

use Spatie\Sluggable\HasSlug;
use Fico7489\Laravel\Pivot\Traits\PivotEventTrait;
use Spatie\Sluggable\SlugOptions;

/**
 * @OA\Schema(
 *   schema="Show",
 *   allOf={
 *     @OA\Schema(
 *       @OA\Property(property="id", type="integer", description="Show id", format="int64"),
 *       @OA\Property(property="title", type="string", description="Show title"),
 *       @OA\Property(property="playlist", type="object", description="The playlist  object of show"),
 *       @OA\Property(property="description", type="string", description="Show description"),
 *       @OA\Property(property="poster", type="object",  description="The poster upload object of show"),
 *       @OA\Property(property="cover", type="object",  description="The cover upload object of show"),
 *     )
 *   }
 * )
 */
class Show extends Model
{
    use SearchableTrait, CallbackCacheTrait;
    use PivotEventTrait, HasSlug;

    public $timestamps = false;

    /**
     * @var array
     */
    public $with = [
        'poster',
        'cover',
        'playlist'
    ];

    /**
     * @var array
     */
    public $hidden = ['playlist_id'];

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
            'description' => 5
        ],
    ];

    protected $fillable = ['title','description','playlist_id'];

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

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    public function getTableColumns()
    {
        return $this->getConnection()->getSchemaBuilder()->getColumnListing($this->getTable());
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function poster()
    {
        return $this->belongsTo('\App\Upload', 'poster', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function playlist()
    {
        return $this->belongsTo('\App\Playlist')
            ->without([
                'assets',
                'poster',
                'cover',
                'meta_tags'
            ])
            ->select([
                'id',
                'name'
            ]);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function cover()
    {
        return $this->belongsTo('\App\Upload', 'cover', 'id');
    }

    /**
    *   Scope for listing load
    *   @param \Illuminate\Database\Eloquent\Builder $query
    *   @return \Illuminate\Database\Eloquent\Builder $query
    */
    public function scopeListSelect($query)
    {
        return $query->selectRaw('id, title, description')->without(['poster', 'cover']);
    }

    /**
     * Copy poster and cover from first playlist by name
     *
     * @param Builder $query
     * @param int|null $playlist_id
     * @return Builder
     */
    public function scopeCopyPosterAndCoverFromPlaylistByTitle(Builder $query, int $playlist_id = null): Builder
    {
        if ($playlist_id) {
            $playlist = Playlist::select('poster_id','cover_id')->find($playlist_id);
        } else {
            $playlist = Playlist::select('poster_id','cover_id')
                ->whereName($this->title)
                ->first();
        }

        if ($playlist) {
            $this->poster()->associate($playlist->poster);
            $this->cover()->associate($playlist->cover);
        }

        return $query;
    }
}
