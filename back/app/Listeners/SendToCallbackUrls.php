<?php

namespace App\Listeners;

use App\Events\CallBackEntityChanged;
use Illuminate\Support\Facades\Artisan;

class SendToCallbackUrls
{

    /**
     * Handle the event.
     *
     * @param  CallBackEntityChanged  $event
     * @return void
     */
    public function handle(CallBackEntityChanged $event)
    {
        Artisan::call('send:clearCacheEntity', [
            'type' => $event->callback->getType(),
            'id' => $event->callback->getId(),
            'action' => $event->callback->getAction()
        ]);
    }
}
