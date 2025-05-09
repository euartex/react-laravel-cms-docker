<?php

namespace App\Observers;
use App\Helpers\HelperObserver;
use App\Banner;
use Illuminate\Support\Carbon;

class BannerObserver
{

    /**
     * Handle the banner "creating" event.
     *
     * @param \App\Banner $banner
     * @return void
     */
    public function creating(Banner $banner)
    {
        $banner->addNewBannerToQueue();
    }


    /**
     * Handle the banner "updating" event.
     *
     * @param \App\Banner $banner
     * @return void
     */
    public function updating(Banner $banner)
    {
        if(isset($banner->getDirty()['order'])  or isset($banner->getDirty()['timeout'])) $banner->resetEndDateForAllBannersSinceThisOrderValue();
    }
 


    /**
     * Handle the banner "deleting" event.
     *
     * @param \App\Banner $banner
     * @return void
     */
    public function restoring(Banner $banner)
    {
        $banner->addNewBannerToQueue();
    }
        
}
