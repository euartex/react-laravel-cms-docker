<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Callback;

class CallBackEntityChanged
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $callback;

    /**
     * PostBackEntityChanged constructor.
     * @param Callback $callback
     * @return void
     */

    public function __construct(Callback $callback)
    {
        $this->callback = $callback;
    }
}
