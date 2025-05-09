<?php

namespace App\Jobs;

use App\Asset;
use App\Enums\AssetType;
use App\Helpers\VDMSHelper;
use App\Services\VDMSAssetService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Builder;

class CheckAssetAvailabilityVDMS implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $collection;

    /**
     * Create a new job instance.
     * @param Collection $collection
     * @return void
     */
    public function __construct(Collection $collection)
    {
        $this->collection = $collection;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(VDMSAssetService $VDMSAssetService)
    {
        $vdmsIds = $this->collection->pluck('vdms_id')->toArray();
        $vdmsResponse = $VDMSAssetService->get((array)$vdmsIds);

        VDMSHelper::actualizeVDMSAvailability($this->collection, (array)$vdmsResponse);
    }
}
