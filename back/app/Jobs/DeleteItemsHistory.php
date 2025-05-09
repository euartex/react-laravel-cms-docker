<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Event;
use Illuminate\Support\Facades\Log;

class DeleteItemsHistory implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $type;
    protected $id;

    /**
     * Create a new job instance.
     *
     * @param $type string
     * @param $id integer
     * @return void
     */
    public function __construct($type, $id)
    {
        $this->queue = 'default';
        $this->type = $type;
        $this->id = $id;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        return Event::where([
            'model_type' => $this->type,
            'model_id' => $this->id
        ])->delete();
    }

    /**
     * @param \Exception $exception
     */
    public function failed(\Exception $exception)
    {
        Log::info($exception->getMessage());
        Log::debug($exception);
    }
}
