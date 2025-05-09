<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Services\VDMSAssetService;
use Illuminate\Support\Facades\Log;

class RemoveAssetFromVdms implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $vdmsIds;

    /**
     * Create a new job instance.
     *
     */
    public function __construct(Array $vdmsIds)
    {
        $this->vdmsIds = $vdmsIds;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(VDMSAssetService $VDMSAssetService)
    {
        try {
            $VDMSAssetService->destroy($this->vdmsIds);
        } catch (\Exception $exception) {
            Log::error('Error remove from vdms job');
            Log::debug($exception);
        }
    }
}
