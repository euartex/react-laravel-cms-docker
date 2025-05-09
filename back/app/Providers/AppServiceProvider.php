<?php

namespace App\Providers;

use Illuminate\Support\Facades\Config;
use App\Company;
use App\Navigation;
use App\Observers\CompanyObserver;
use App\Observers\NavigationObserver;
use App\Observers\PlaylistObserver;
use App\Observers\ProjectObserver;
use App\Observers\AssetObserver;
use App\Observers\UploadObserver;
use App\Observers\BannerObserver;
use App\Observers\HistoryObserver;
use App\Observers\TagObserver;
use App\Observers\UserObserver;
use App\Observers\ShowObserver;
use App\Playlist;
use App\Asset;
use App\Project;
use App\Banner;
use App\StaticPage;
use App\Upload;
use App\Tag;
use App\Show;
use Panoscape\History\History;
use Illuminate\Support\ServiceProvider;
use App\User;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->register(\L5Swagger\L5SwaggerServiceProvider::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {

        Config::set('seeding', false);

        /**
         *    Observers
         */
        Navigation::observe(NavigationObserver::class);
        Project::observe(ProjectObserver::class);
        Playlist::observe(PlaylistObserver::class);
        Asset::observe(AssetObserver::class);
        Upload::observe(UploadObserver::class);
        Company::observe(CompanyObserver::class);
        Banner::observe(BannerObserver::class);
        History::observe(HistoryObserver::class);
        Tag::observe(TagObserver::class);
        User::observe(UserObserver::class);
        Show::observe(ShowObserver::class);

        /**
         *   Reorder items
         */
        StaticPage::deleting(function ($model) {
            $model->next()->decrement('order');
        });
    }
}
