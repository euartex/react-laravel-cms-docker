<?php

namespace App\Observers;

use App\Upload;
use App\Jobs\ImageResize;
use Illuminate\Support\Facades\Log;


class UploadObserver
{

    /**
     * Handle the upload "saved" event.
     *
     * @param \App\Upload $upload
     * @return void
     */
    public function saved(Upload $upload)
    {
        
        if ($upload->tmp){ 

            /**
            *  Image resize job dispatch
            */
            ImageResize::dispatch($upload);

            
            /**
            *  Fire model update event for parents by relationships
            */
            $upload->updateEventForRelations();
        }
    }


    /**
     * Handle the upload "saving" event.
     *
     * @param \App\Upload $upload
     * @return void
     */
    public function saving(Upload $upload)
    {
        $upload->previus_state = $upload->fresh();
    }

    /**
     * Handle the upload "deleted" event.
     *
     * @param \App\Upload $upload
     * @return void
     */
    public function deleted(Upload $upload)
    {
        //
    }

    /**
     * Handle the upload "restored" event.
     *
     * @param \App\Upload $upload
     * @return void
     */
    public function restored(Upload $upload)
    {
        //
    }

    /**
     * Handle the upload "force deleted" event.
     *
     * @param \App\Upload $upload
     * @return void
     */
    public function forceDeleted(Upload $upload)
    {
        //
    }
}
