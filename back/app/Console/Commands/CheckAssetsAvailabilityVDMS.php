<?php

namespace App\Console\Commands;

use App\Enums\AssetType;
use App\Jobs\CheckAssetAvailabilityVDMS;
use App\Mail\TestMail;
use App\Services\VDMSAssetService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Asset;
use Illuminate\Support\Str;

class CheckAssetsAvailabilityVDMS extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:vdms';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Checking status video in VDMS';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(VDMSAssetService $VDMSAssetService)
    {
        //https://docs.vdms.com/video/Content/Develop/Asset.htm#getassetbyid
        $perRequest = config('vdms.maxAssetsPerGetRequest');

        $assets = Asset::where([
            ['type', AssetType::Video],
            ['vdms_id', '!=', null]
        ]);

        $assetsCount = $assets->get()->count();
        $requests = ceil($assetsCount/$perRequest);


        for ($i = 1;  $i <= $requests; $i++) {
            $limitedAssets = $assets->offset(($i - 1) * $perRequest)->limit($perRequest)->get();
            CheckAssetAvailabilityVDMS::dispatch($limitedAssets);
        }
    }
}
