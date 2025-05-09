<?php

namespace App\Jobs;

use App\Services\VDMSAssetService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class StoreToVDMSJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    protected $asset;
    public $tries = 7;

    protected $fileName;

    /**
     * Create a new job instance.
     *
     * @param $fileName string
     */
    public function __construct($asset)
    {
        $this->asset = $asset;
        $this->queue = 'upload-vdms';
    }

    /**
     * Execute the job.
     *
     * @param  VideoUploadService  $videoUploadService
     *
     * @return void
     */
    public function handle(VDMSAssetService $videoService)
    {
        try {

            $videoService->storeToVDMS($this->asset);

        } catch (\Exception $exception) {

            Log::info('Error store to vdms job');
            Log::debug($exception);
            //  $->destroy($this->fileName);
            //  $this->fail($exception);
        }
    }
}
