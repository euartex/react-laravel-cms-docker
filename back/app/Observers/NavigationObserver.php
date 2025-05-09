<?php

namespace App\Observers;

use App\Navigation;
use App\DeviceType;

class NavigationObserver
{
    /**
     * Handle the navigation "created" event.
     *
     * @param \App\Navigation $navigation
     * @return void
     */
    public function created(Navigation $navigation)
    {
        //Now we don't separate navigation and device type
        $types = DeviceType::all();
        $navigation->deviceTypes()->attach(
            $types->pluck('id')->toArray()
        );
    }

//    public function creating(Navigation $navigation)
//    {
//        //REMOVE LOGIC WITH NAVIGATION TYPE. SET TYPE ID BY DEFAULT
//        $navigation->type_id = 1;
//    }

}
