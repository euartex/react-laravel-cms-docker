<?php

namespace App;

use App\Traits\ClearHistory;
use Illuminate\Database\Eloquent\Model;
use BenSampo\Enum\Traits\CastsEnums;
use Illuminate\Database\Eloquent\Builder;
use Nicolaslopezj\Searchable\SearchableTrait;
use App\Traits\BelongsToSortedManyCustomTrait;
use Panoscape\History\HasHistories;
use App\Traits\HasPivotForHistory;
use App\Traits\HasCache;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use App\Enums\StatusAsset;
use App\Enums\AssetType;
use Fico7489\Laravel\Pivot\Traits\PivotEventTrait;
use App\Mail\AssetPublished;
use Illuminate\Support\Facades\Mail;
use App\Traits\CallbackCacheTrait;
use App\Scopes\AssetScope;


class Asset extends Model
{
    public $timestamps = true;

    use PivotEventTrait, HasSlug, CastsEnums, SearchableTrait, BelongsToSortedManyCustomTrait, HasHistories, HasPivotForHistory,CallbackCacheTrait, ClearHistory, HasCache;

    public static function boot()
    {
        parent::boot();

        static::pivotAttached(function ($model, $relationName, $pivotIds, $pivotIdsAttributes) {

            /**
            *   Attaching current asset to playlists by attached tags
            */
            if($relationName === 'tags') $model->attachToPlaylistByMetaTags();
        });
    }


    public $table = 'assets';

    /**
     * Searchable rules.
     *
     * @var array
     */
    public $searchable = [
        /**
         * Columns and their priority in search results.
         * Columns with higher values are more important.
         * Columns with equal values have equal importance.
         *
         * @var array
         */
        'columns' => [
            'title' => 10,
            'description' => 5,
        ],
    ];

    public $with = ['poster', 'cover', 'tags'];

    public $hidden = ['relevance', 'length', 'deleted_at'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    public $fillable = [
        'title',
        'long_description',
        'description',
        'seo_title',
        'seo_description',
        'company_id',
        'project_id',
        'start_on',
        'end_on',
        'path_mezaninne',
        'vdms_id',
        'type',
        'wp_post_id',
        'url',
        'is_main'
    ];

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    public function getModelLabel()
    {
        return $this->display_name;
    }

    public function poster()
    {
        return $this->belongsTo('\App\Upload', 'poster', 'id');
    }

    public function tags()
    {
        return $this->belongsToMany('\App\Tag','asset_tag','asset_id','tag_id');
    }

    public function cover()
    {
        return $this->belongsTo('\App\Upload', 'cover', 'id');
    }

    public function project()
    {
        return $this->belongsTo('\App\Project');
    }

    public function company()
    {
        return $this->belongsTo('\App\Company');
    }

    public function playlist()
    {
        return $this->belongsToSortedManyCustom('\App\Playlist', 'order')->withPivot('order')->orderBy('order');
    }

    public function getMetaTagsAttribute()
    {
        $tags = $this->tags->pluck('title');

        return $tags;
    }

    public function getVdmsUrlAttribute($value)
    {
        return ($this->type === AssetType::Video) ? config('vdms.url') . '/' . $this->vdms_id . '.' . config('vdms.extension') : (($this->type === AssetType::Livefeed) ? $this->url : null);
    }

    /**
    *   Set "published_at" date by "published" status
    */
    public function setStatusAttribute($value)
    {
        switch($value){

            case StatusAsset::Published:
                $this->published_at = now();
            break;

            default:
                $this->published_at = null;
            break;
        }

        $this->attributes['status'] = $value;
    }

    public function getTableColumns()
    {
        return $this->getConnection()->getSchemaBuilder()->getColumnListing($this->getTable());
    }


    /**
    *   Scope for listing load
    *   @param \Illuminate\Database\Eloquent\Builder $query
    *   @return \Illuminate\Database\Eloquent\Builder $query
    */
    public function scopeListSelect($query)
    {
        return $query->without(['poster','cover'])->selectRaw('title,id,created_at,start_on,end_on,description,project_id,company_id,vdms_id,is_main,status,type,is_vdms_deleted');
    }


    /**
    *   Scope for select assets without wp auto drafts
    *   @param \Illuminate\Database\Eloquent\Builder $query
    *   @return \Illuminate\Database\Eloquent\Builder $query
    */
    public function scopeWithoutWpAutoDrafts($query)
    {
        return $query->where('status', '!=', StatusAsset::WpAutoDraft);
    }


    /**
    *   Scope for get assets without default scope of relations
    *   @param \Illuminate\Database\Eloquent\Builder $query
    *   @return \Illuminate\Database\Eloquent\Builder $query
    */
    public function scopeSelectOnlyId($query)
    {
        return $query->without(['poster','cover','tags'])->selectRaw('id');
    }


    /**
     *   Attach asset with order to playlists which contains same tag
     *
     * @return bool
     */
    public function attachToPlaylistByMetaTags(): Bool
    {

        $asset = $this;

        $asset->refresh();

        $playlists_with_same_tag_without_this_asset = Playlist::whereHas('meta_tags', function (Builder $query) use ($asset) {

            $query->whereIn('tag_id', $asset->tags->pluck('id'));

        })->whereDoesntHave('assets',  function (Builder $query) use ($asset) {

            $query->whereId($asset->id);

        })->selectRaw('id')->with(['meta_tags'])->get();


        if ($playlists_with_same_tag_without_this_asset) {

            $playlists_with_same_tag_without_this_asset->map(function ($playlist) use ($asset) {

                if ($playlist) {

                    $playlist->assets()->attach($asset);

                    /**
                    *   Checking for is_asset_pl_add_sort_by_id is  true or not for tags inside playlists and current asset
                    */
                    if($playlist->meta_tags->pluck(['is_asset_pl_add_sort_by_id'])->contains(true) and $asset->tags->pluck(['is_asset_pl_add_sort_by_id'])->contains(true)){


                        /**
                        *   Order by date inside playlist (if tag has is_asset_pl_add_sort_by_id is checked)
                        */
                        if($asset_after = $playlist->assets()->where('id', '<', $asset->id)->orderBy('id', 'DESC')->selectOnlyId()->first() and $this_asset_in_pl = $playlist->assets()->selectOnlyId()->find($asset)){

                            return $playlist->assets()->moveBefore($this_asset_in_pl, $asset_after);

                        }
                    }

                    /**
                    *   Move to first place inside playlist (if tag has is_asset_pl_add_sort_by_id isn't checked)
                    */
                    if($first_asset_in_pl = $playlist->assets()->selectOnlyId()->orderBy('order', 'ASC')->first() and $this_asset_in_pl = $playlist->assets()->selectOnlyId()->find($asset)){

                        return $playlist->assets()->moveBefore($this_asset_in_pl, $first_asset_in_pl);
                    }

                }
            });

            return true;
        }

        return false;
    }


    /**
    *   Send published asset by email
    *
    *   @return boolean
    */
    public  function sendAssetPublishedEmail(){

        if(config('mail.to.new_asset_published')) {
            try{
                Mail::send(new AssetPublished($this, explode(',', config('mail.to.new_asset_published'))));
            }catch(\Exception $e){
                \Log::warning($e->getMessage());
            }
        }

        return false;
    }

    /**
    *   Unset  mark "is_main"  for old main asset with "livefeed" type
    *
    *   @param $query
    *   @return boolean
    */
    public function scopeIsNotMainForPreviousLivefeed($query){

        if($main_asset = $query->whereIsMain(true)
            ->whereType(AssetType::Livefeed)
            ->where('id', '!=', $this->id)
            ->first()){

                $main_asset->is_main = false;

                return $main_asset->save();
        }

        return false;
    }
}
