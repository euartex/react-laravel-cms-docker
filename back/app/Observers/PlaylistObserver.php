<?php

namespace App\Observers;

use App\Helpers\HelperObserver;
use App\Playlist;

class PlaylistObserver
{
    /**
     * Handle the playlist "creating" event.
     *
     * @param \App\Playlist $playlist
     * @return void
     */
    public function creating(Playlist $playlist)
    {
        if (! config('seeding')) $playlist->playlist_id = unique_random(new Playlist, 'playlist_id', 15);
    }

    /**
     * Handle the playlist "created" event.
     *
     * @param \App\Playlist $playlist
     * @return void
     */
    public function created(Playlist $playlist)
    {
        if($playlist->is_top) $playlist->unsetPreviousTopMark();
    }

    /**
     * Handle the playlist "saved" event.
     *
     * @param \App\Playlist $playlist
     * @return void
     */
    public function saved(Playlist $playlist)
    {

        if($playlist->is_top) $playlist->unsetPreviousTopMark();

        /**
         *  Updating all navigations where playlist exist
         */
        if($playlist->navigations) {
            $playlist->navigations->each(function ($navigation) {
                $navigation->touch();
            });
        }
    }

}
