<?php

namespace App\Observers;

use App\Show;

class ShowObserver
{
    /**
     * Handle the show "created" event.
     *
     * @param  \App\Show  $show
     * @return void
     */
    public function created(Show $show)
    {
        // Get all fields
        $show->refresh();

        // Copy poster and cover from first playlist by name or by playlist_id
        $show->copyPosterAndCoverFromPlaylistByTitle($show->playlist->id ?? null);
        $show->save();
    }

    /**
     * Handle the show "updated" event.
     *
     * @param  \App\Show  $show
     * @return void
     */
    public function updated(Show $show)
    {
        // Copy poster and cover from  playlist by playlist_id
        if (isset($show->playlist)) {
            $show->refresh();
            $show->copyPosterAndCoverFromPlaylistByTitle($show->playlist->id);
            $show->save();
        }
    }

    /**
     * Handle the show "deleted" event.
     *
     * @param  \App\Show  $show
     * @return void
     */
    public function deleted(Show $show)
    {
        //
    }

    /**
     * Handle the show "restored" event.
     *
     * @param  \App\Show  $show
     * @return void
     */
    public function restored(Show $show)
    {
        //
    }

    /**
     * Handle the show "force deleted" event.
     *
     * @param  \App\Show  $show
     * @return void
     */
    public function forceDeleted(Show $show)
    {
        //
    }
}
