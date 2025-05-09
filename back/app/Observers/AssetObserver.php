<?php

namespace App\Observers;

use App\Asset;
use App\Enums\AssetType;
use App\Jobs\CheckAssetAvailabilityVDMS;
use App\Jobs\RemoveAssetFromVdms;
use App\Http\Controllers\API\v1\AssetController;
use Illuminate\Database\Eloquent\Collection;

class AssetObserver
{
    /**
     * Handle the asset "creating" event.
     *
     * @param \App\Asset $asset
     * @return void
     */
    public function creating(Asset $asset)
    {
        /**
        * Asset id generation
        */
        if (! config('seeding')) $asset->asset_id = unique_random(new Asset, 'asset_id', 15);

        /**
        *   if  value for "is_main = true" but type not "livefeed" - set "is_main = false"
        */
        if($asset->is_main and $asset->type !== AssetType::Livefeed) unset($asset->is_main);
    }

    /**
     * Handle the asset "created" event.
     *
     * @param \App\Asset $asset
     * @return void
     */
    public function created(Asset $asset)
    {
        /**
        *   if "is_main = true" - setup "is_main = false" for previous main livefeed
        */
        if($asset->is_main) $asset->IsNotMainForPreviousLivefeed();


        /**
        *   Callback method which returns asset (type=article)
        */
        if($asset->type === AssetType::Article) (new AssetController())->callback($asset, __FUNCTION__);
    }

    /**
     * Handle the asset "saving" event.
     *
     * @param \App\Asset $asset
     * @return void
     */
    public function saving(Asset $asset)
    {
        /**
        *   if new value for "is_main = true" but type not "livefeed" - set "is_main = false"
        */
        if($asset->is_main and $asset->type !== AssetType::Livefeed) unset($asset->is_main);
    }

    /**
     * Handle the asset "saved" event.
     *
     * @param \App\Asset $asset
     * @return void
     */
    public function saved(Asset $asset)
    {
        /**  if "is_main = true" - set "is_main = false" for old main asset */
        if ($asset->is_main) $asset->IsNotMainForPreviousLivefeed();

        /**
         *  Updating all playlist where asset exist
         */
        if ($asset->playlist) {

            $asset->playlist->each(function ($playlist) {

                $playlist->touch();
            });
        }
    }

    /**
     * Handle the asset "updated" event.
     *
     * @param \App\Asset $asset
     * @return void
     */
    public function updated(Asset $asset)
    {
        if ($asset->type === AssetType::Video && $asset->vdms_id !== null) {
            $collection = new Collection();
            CheckAssetAvailabilityVDMS::dispatch($collection->push($asset));
        }
    }

    /**
     * Handle the asset "deleting" event.
     *
     * @param \App\Asset $asset
     * @return void
     */
    public function deleting(Asset $asset)
    {
        //
    }

    /**
     * Handle the asset "deleted" event.
     *
     * @param \App\Asset $asset
     * @return void
     */
    public function deleted(Asset $asset)
    {
       /** Remove assets from VDMS */
        if(!is_null($asset->vdms_id))  RemoveAssetFromVdms::dispatch((array)$asset->vdms_id);
    }

    /**
     * Handle the asset "restored" event.
     *
     * @param \App\Asset $asset
     * @return void
     */
    public function restored(Asset $asset)
    {
        //
    }

    /**
     * Handle the asset "force deleted" event.
     *
     * @param \App\Asset $asset
     * @return void
     */
    public function forceDeleted(Asset $asset)
    {
        //
    }
}
