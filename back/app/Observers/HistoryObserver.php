<?php

namespace App\Observers;

use Panoscape\History\History;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;

class HistoryObserver
{
     
    /**
     * Handle the history "creating" event.
     *
     * @param \App\History $history
     * @return void
     */
    public function creating(History $history)
    {   
        /**
        *   If meta field is  empty - do not create new revision row
        */
        if(! $history->meta) return false;
    }

    /**
     * Handle the history "saved" event.
     *
     * @param \App\History $history
     * @return void
     */
    public function saved(History $history)
    {
         
    }

    /**
     * Handle the history "updated" event.
     *
     * @param \App\History $history
     * @return void
     */
    public function updated(History $history)
    {

    }

    /**
     * Handle the history "deleted" event.
     *
     * @param \App\History $history
     * @return void
     */
    public function deleted(History $history)
    {
 
    }

    /**
     * Handle the history "restored" event.
     *
     * @param \App\History $history
     * @return void
     */
    public function restored(History $history)
    {
        //
    }

    /**
     * Handle the history "force deleted" event.
     *
     * @param \App\History $history
     * @return void
     */
    public function forceDeleted(History $history)
    {
        //
    }
}
