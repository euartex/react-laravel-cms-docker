<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;
use App\Asset;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class AssetDelete
 * @package App\Jobs
 */
class AssetDelete implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected Collection $assets;

    public $tries = 2;

    /**
     * AssetDelete constructor.
     * @param Asset $asset
     */
    public function __construct(Collection $assets)
    {
        $this->assets = $assets;
    }

    /**
     * @return bool
     * @throws \Exception
     */
    public function handle()
    {
        foreach ($this->assets as $asset) {
            $asset->delete();
        }

        return true;
    }

    /*
    * Execute the job.
    *
    * @return void
    */
   public function failed()
   {
        Log::error('failed');

        return false;
   }
}
