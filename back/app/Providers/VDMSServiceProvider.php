<?php

namespace App\Providers;


use App\Services\VDMSAssetService;
use App\Services\VDMSJobService;
use App\Services\VDMSService;
use App\Services\StorageService;
use App\Services\AssetsStorageService;
use Illuminate\Support\ServiceProvider;

class VDMSServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(VDMSService::class, function ($app) {
            return new VDMSService(config('vdms'));
        });
        $this->app->singleton(VDMSAssetService::class, function ($app) {
            return new VDMSAssetService($app->make(VDMSService::class));
        });

        $this->app->singleton(StorageService::class, function ($app) {
            return new StorageService(config('vdms'));
        });
    }
}
