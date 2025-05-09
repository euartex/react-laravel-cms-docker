<?php

use Illuminate\Support\Facades\Route;
use App\Enums\PermissionGroup;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::group(['namespace' => 'API\v1'], function () {
    Route::post('/callback/debug', 'CallbackEndpointController@debug');

    Route::group(['prefix' => 'auth'], function () {
        Route::group(['middleware' => 'guest'], function () {
            Route::post('', 'AuthorizationController@authenticate')->name('auth.login'); //"SingIn" route
            Route::post('auth-token-refresh', 'AuthorizationController@tokenRefresh')->name('auth.token.refresh'); //"Auth token refresh" route
        });

        Route::group(['middleware' => 'auth:api'], function () {
            Route::post('logout', 'AuthorizationController@logout'); //"User logout" route
        });
    });

    /**
    *   Base reset password find
    */
    Route::group(['prefix' => 'reset-password'], function () {
        Route::get('find/{token}', 'PasswordResetController@find')->name('password.reset.find');
    });

    /**
    *  Assets hook routes without auth
    */
    Route::group(['prefix' => 'assets'], function () {
        Route::post('publish-by-hook', 'AssetController@publishByHook')->name('asset.hook.publish');
    });

    Route::group(['prefix' => 'cms-users'], function () {

        /**
         *   CMS user reset password
         */
        Route::group(['prefix' => 'reset-password'], function () {
            Route::post('create', 'CmsUserPasswordResetController@cmsUserResetPasswordCreate')->name('cms.user.password.reset.create');
            Route::post('reset', 'CmsUserPasswordResetController@cmsUserResetPasswordReset')->name('cms.user.password.reset.reset');
        });

        /**
         *   Verify email with signature
         */
        Route::group(['prefix' => 'verification'], function () {
            Route::get('', 'VerificationController@verify')->name('verification.verify');
        });
    });

    Route::group(['middleware' => 'auth:api'], function () {
        Route::group(['prefix' => 'cms-users'], function () {

            /**
             *   CMS user email verification
             */
            Route::group(['prefix' => 'verification'], function () {
                Route::post('', 'VerificationController@send')->name('verification.verify.send');
            });

            /**
             *   Current user operations
             */
            Route::group(['prefix' => 'me'], function () {
                Route::put('update', 'CmsUserController@updateMe')->name('me.update');
            });

            /**
             *   CMS user CRUD
             */
            Route::get('', 'CmsUserController@index')->name('cms.user.index')->middleWare('permission:' . PermissionGroup::CmsUser . ', Get list of CMS users');
            Route::get('{id}', 'CmsUserController@show')->name('cms.user.show')->middleWare('permission:' . PermissionGroup::CmsUser . ', Show specific CMS user');
            Route::put('{id}', 'CmsUserController@update')->name('cms.user.update')->middleWare('permission:' . PermissionGroup::CmsUser . ', Update specific CMS user');
            Route::delete('{id}', 'CmsUserController@destroy')->name('cms.user.destroy')->middleWare('permission:' . PermissionGroup::CmsUser . ', Destroy specific CMS user');
            Route::post('', 'CmsUserController@store')->name('cms.user.store')->middleWare('permission:' . PermissionGroup::CmsUser . ', Store new CMS user');
        });

        /**
         *   Roles CRUD
         */
        Route::group(['prefix' => 'roles'], function () {
            Route::get('accessible-roles-list', 'RolesController@list');
            Route::get('permissions', 'RolesController@getPermissionsList')->name('roles.permission.index');
            Route::get('', 'RolesController@index')->name('roles.index')->middleWare('permission:' . PermissionGroup::Permission . ', Get list of roles');
            Route::get('{id}', 'RolesController@show')->name('roles.show')->middleWare('permission:' . PermissionGroup::Permission . ', Show specific role');
            Route::put('{id}', 'RolesController@update')->name('roles.update')->middleWare('permission:' . PermissionGroup::Permission . ', Update specific role');
            Route::delete('{id}', 'RolesController@destroy')->name('roles.destroy')->middleWare('permission:' . PermissionGroup::Permission . ', Destroy specific role');
            Route::post('', 'RolesController@store')->name('roles.store')->middleWare('permission:' . PermissionGroup::Permission . ', Store new role');
        });

        /**
         *   App users
         */
        Route::group(['prefix' => 'app-users'], function () {
            /**
            *   App user reset password
            */
            Route::group(['prefix' => 'reset-password'], function () {
                Route::post('create', 'AppUserPasswordResetController@appUserResetPasswordCreate')->name('app.user.password.reset.create')->middleWare('permission:' . PermissionGroup::AppUser . ', To create reset password');
                Route::post('reset', 'AppUserPasswordResetController@appUserResetPasswordReset')->name('app.user.password.reset.reset')->middleWare('permission:' . PermissionGroup::AppUser . ', To handle reset password process');
            });

            /**
             *   App user CRUD
             */
            Route::get('', 'AppUserController@index')->name('app.user.index')->middleWare('permission:' . PermissionGroup::AppUser . ', Get list of app users');
            Route::get('{id}', 'AppUserController@show')->name('app.user.show')->middleWare('permission:' . PermissionGroup::AppUser . ', Show cpecific app user');
            Route::put('{id}', 'AppUserController@update')->name('app.user.update')->middleWare('permission:' . PermissionGroup::AppUser . ', Update specific app user');
            Route::delete('{id}', 'AppUserController@destroy')->name('app.user.destroy')->middleWare('permission:' . PermissionGroup::AppUser . ', Destroy specific app user');
            Route::post('', 'AppUserController@store')->name('app.user.store')->middleWare('permission:' . PermissionGroup::AppUser . ', Store new app user');
        });

        /**
         *  Metadata CRUD
         */
        Route::group(['prefix' => 'metadata'], function () {
            Route::get('accessible-list', 'MetaDataController@list');
            Route::put('{id}', 'MetaDataController@update')->name('metadata.update')->middleWare('permission:' . PermissionGroup::Metadata . ', Update specific metadata');
            Route::post('', 'MetaDataController@store')->name('metadata.store')->middleWare('permission:' . PermissionGroup::Metadata . ', Store specific metadata');
            Route::get('', 'MetaDataController@index')->name('metadata.index')->middleWare('permission:' . PermissionGroup::Metadata . ', Get list of metadata');
            Route::delete('{id}', 'MetaDataController@destroy')->name('metadata.destroy')->middleWare('permission:' . PermissionGroup::Metadata . ', Destroy specific metadata');
            Route::get('{id}', 'MetaDataController@show')->name('metadata.show')->middleWare('permission:' . PermissionGroup::Metadata . ', Show specific metadata');
        });

        /**
         *  Callback endpoints CRUD
         */
        Route::group(['prefix' => 'callback-endpoints'], function () {
            Route::get('', 'CallbackEndpointController@index')->name('callback-endpoint.index')->middleWare('permission:' . PermissionGroup::CallbackEndpoint . ', Get list of callback endpoints');
            Route::get('{id}', 'CallbackEndpointController@show')->name('callback-endpoint.show')->middleWare('permission:' . PermissionGroup::CallbackEndpoint . ', Show specific callback endpoint');
            Route::delete('{id}', 'CallbackEndpointController@destroy')->name('callback-endpoint.destroy')->middleWare('permission:' . PermissionGroup::CallbackEndpoint . ', Destroy specific callback endpoint');
            Route::put('{id}', 'CallbackEndpointController@update')->name('callback-endpoint.update')->middleWare('permission:' . PermissionGroup::CallbackEndpoint . ', Update specific callback endpoint');
            Route::post('', 'CallbackEndpointController@store')->name('callback-endpoint.store')->middleWare('permission:' . PermissionGroup::CallbackEndpoint . ', Store specific callback endpoint');
        });

        /**
         *  Banner CRUD
         */
        Route::group(['prefix' => 'banners'], function () {
            Route::put('{id}', 'BannerController@update')->name('banner.update')->middleWare('permission:' . PermissionGroup::Banner . ', Update specific banners');
            Route::post('', 'BannerController@store')->name('banner.store')->middleWare('permission:' . PermissionGroup::Banner . ', Store specific banner');
            Route::get('', 'BannerController@index')->name('banner.index')->middleWare('permission:' . PermissionGroup::Banner . ', Get list of banners');
            Route::delete('', 'BannerController@destroy')->name('banner.destroy')->middleWare('permission:' . PermissionGroup::Banner . ', Destroy specific banner');
            Route::post('restore', 'BannerController@restore')->name('banner.restore')->middleWare('permission:' . PermissionGroup::Banner . ', Restore specific banner');
            Route::get('{id}', 'BannerController@show')->name('banner.show')->middleWare('permission:' . PermissionGroup::Banner . ', Show specific banner');
            Route::post('order', 'BannerController@order')->name('banner.order')->middleWare('permission:' . PermissionGroup::Banner . ', Sorting for specific banner');
        });

        /**
         *  Tag CRUD
         */
        Route::group(['prefix' => 'tags'], function () {
            Route::get('accessible-list', 'TagController@list');
            Route::put('{id}', 'TagController@update')->name('tag.update')->middleWare('permission:' . PermissionGroup::Tag . ', Update specific tags');
            Route::post('', 'TagController@store')->name('tag.store')->middleWare('permission:' . PermissionGroup::Tag . ', Store specific tag');
            Route::get('', 'TagController@index')->name('tag.index')->middleWare('permission:' . PermissionGroup::Tag . ', Get list of tags');
            Route::delete('{id}', 'TagController@destroy')->name('tag.destroy')->middleWare('permission:' . PermissionGroup::Tag . ', Destroy specific tag');
            Route::get('{id}', 'TagController@show')->name('tag.show')->middleWare('permission:' . PermissionGroup::Tag . ', Show specific tag');
        });

        /**
         *  Static page CRUD
         */
        Route::group(['prefix' => 'static-pages'], function () {
            Route::get('', 'StaticPageController@index')->name('static.page.index')->middleWare('permission:' . PermissionGroup::StaticPage . ', Get list of static pages');
            Route::get('{id}', 'StaticPageController@show')->name('static.page.show')->middleWare('permission:' . PermissionGroup::StaticPage . ', Show specific static page');
            Route::put('{id}', 'StaticPageController@update')->name('static.page.update')->middleWare('permission:' . PermissionGroup::StaticPage . ', Update specific static page');
            Route::delete('{id}', 'StaticPageController@destroy')->name('static.page.destroy')->middleWare('permission:' . PermissionGroup::StaticPage . ', Destroy specific static page');
            Route::post('', 'StaticPageController@store')->name('static.page.store')->middleWare('permission:' . PermissionGroup::StaticPage . ', Store specific static page');
            Route::post('order', 'StaticPageController@order')->name('static.page.order')->middleWare('permission:' . PermissionGroup::StaticPage . ', Order specific static page');
        });

        /**
         *  Sort
         *  Do not remove!
         */
        Route::post('sort', '\Rutorika\Sortable\SortableController@sort')->name('sort');

        /**
         *  Events route
         */
        Route::group(['prefix' => 'events'], function () {
            Route::get('', 'EventController@index')->name('events.index')->middleWare('permission:' . PermissionGroup::Event . ', Get list of events');
        });

        /**
         *  Articles CRUD
         */
        Route::group(['prefix' => 'articles'], function () {
            Route::get('', 'ArticleController@index')->name('article.index')->middleWare('permission:' . PermissionGroup::Article . ', Get list of articles');
            Route::delete('', 'ArticleController@destroy')->name('article.destroy')->middleWare('permission:' . PermissionGroup::Article . ', Destroy specific article');
            Route::get('{id}', 'ArticleController@show')->name('article.show')->middleWare('permission:' . PermissionGroup::Article . ', Show specific article');
            Route::put('{id}', 'ArticleController@update')->name('article.update')->middleWare('permission:' . PermissionGroup::Article . ', Update specific article');
            Route::post('', 'ArticleController@store')->name('article.store')->middleWare('permission:' . PermissionGroup::Article . ', Store specific article');
        });

        /**
         *  Livefeeds CRUD
         */
        Route::group(['prefix' => 'livefeeds'], function () {
            Route::get('', 'LivefeedController@index')->name('livefeed.index')->middleWare('permission:' . PermissionGroup::Livefeed . ', Get list of livefeeds');
            Route::delete('', 'LivefeedController@destroy')->name('livefeed.destroy')->middleWare('permission:' . PermissionGroup::Livefeed . ', Destroy specific livefeed');
            Route::get('{id}', 'LivefeedController@show')->name('livefeed.show')->middleWare('permission:' . PermissionGroup::Livefeed . ', Show specific livefeed');
            Route::put('{id}', 'LivefeedController@update')->name('livefeed.update')->middleWare('permission:' . PermissionGroup::Livefeed . ', Update specific livefeed');
            Route::post('', 'LivefeedController@store')->name('livefeed.store')->middleWare('permission:' . PermissionGroup::Livefeed . ', Store specific livefeed');
        });

        /**
         *  Assets CRUD
         */
        Route::group(['prefix' => 'assets'], function () {
            Route::get('', 'AssetController@index')->name('asset.index')->middleWare('permission:' . PermissionGroup::Asset . ', Get list of assets');
            Route::delete('', 'AssetController@destroy')->name('asset.destroy')->middleWare('permission:' . PermissionGroup::Asset . ', Destroy specific asset');
            Route::get('{id}', 'AssetController@show')->name('asset.show')->middleWare('permission:' . PermissionGroup::Asset . ', Show specific asset');
            Route::put('{id}', 'AssetController@update')->name('asset.update')->middleWare('permission:' . PermissionGroup::Asset . ', Update specific asset');
            Route::post('', 'AssetController@store')->name('asset.store')->middleWare('permission:' . PermissionGroup::Asset . ', Store specific asset');
            Route::post('{id}/mezanine/upload/video', 'AssetController@uploadVideoToMezanine')->name('asset.upload.video')->middleWare('permission:' . PermissionGroup::Asset . ', Store specific video to mezanine');
            Route::post('import', 'AssetController@import')->name('asset.import')->middleWare('permission:' . PermissionGroup::Asset . ', Assets import');
        });

        /**
         *  Navigation CRUD
         */
        Route::group(['prefix' => 'navigations'], function () {
            Route::get('types', 'NavigationController@types');
            Route::get('', 'NavigationController@index')->name('navigation.index')->middleWare('permission:' . PermissionGroup::Navigation . ', Get list of navigation');
            Route::get('{id}', 'NavigationController@show')->name('navigation.show')->middleWare('permission:' . PermissionGroup::Navigation . ', Show specific navigation item');
            Route::post('', 'NavigationController@store')->name('navigation.store')->middleWare('permission:' . PermissionGroup::Navigation . ', Assets import');
            Route::put('{id}', 'NavigationController@update')->name('navigation.update')->middleWare('permission:' . PermissionGroup::Navigation . ', Store specific navigation item');
            Route::delete('{id}', 'NavigationController@destroy')->name('navigation.destroy')->middleWare('permission:' . PermissionGroup::Navigation . ', Destroy specific navigation item');
            Route::post('restore/{id}', 'NavigationController@restore')->name('navigation.restore')->middleWare('permission:' . PermissionGroup::Navigation . ', Store specific navigation item');
            Route::post('order', 'NavigationController@order')->name('navigation.order')->middleWare('permission:' . PermissionGroup::Navigation . ', Order navigation items');
            Route::post('{id}/order-playlists', 'NavigationController@orderPlaylists')->name('navigation.order-playlists')->middleWare('permission:' . PermissionGroup::Navigation . ', Order playlists in specific navigation item');
        });

        /**
         *  Companies CRUD
         */
        Route::group(['prefix' => 'companies'], function () {
            Route::get('accessible-list', 'CompanyController@list');
            Route::get('', 'CompanyController@index')->name('company.index')->middleWare('permission:' . PermissionGroup::Company . ', Get list of companies');
            Route::get('{id}', 'CompanyController@show')->name('company.show')->middleWare('permission:' . PermissionGroup::Company . ', Show specific company');
            Route::post('', 'CompanyController@store')->name('company.store')->middleWare('permission:' . PermissionGroup::Company . ', Store specific company');
            Route::put('{id}', 'CompanyController@update')->name('company.update')->middleWare('permission:' . PermissionGroup::Company . ', Update specific company');
            Route::delete('{id}', 'CompanyController@destroy')->name('company.destroy')->middleWare('permission:' . PermissionGroup::Company . ', Destroy specific company');
        });

        /**
         *  Projects CRUD
         */
        Route::group(['prefix' => 'projects'], function () {
            Route::get('accessible-list', 'ProjectController@list');
            Route::get('', 'ProjectController@index')->name('project.index')->middleWare('permission:' . PermissionGroup::Project . ', Get list of projects');
            Route::get('{id}', 'ProjectController@show')->name('project.show')->middleWare('permission:' . PermissionGroup::Project . ', Show specific project');
            Route::post('', 'ProjectController@store')->name('project.store')->middleWare('permission:' . PermissionGroup::Project . ', Store specific project');
            Route::put('{id}', 'ProjectController@update')->name('project.update')->middleWare('permission:' . PermissionGroup::Project . ', Update specific project');
            Route::delete('{id}', 'ProjectController@destroy')->name('project.destroy')->middleWare('permission:' . PermissionGroup::Project . ', Destroy specific project');
            Route::post('restore/{id}', 'ProjectController@restore')->name('project.restore')->middleWare('permission:' . PermissionGroup::Project . ', Restore specific project');
        });

        /**
         *  Shows CRUD
         */
        Route::group(['prefix' => 'shows'], function () {
            Route::get('accessible-list', 'ShowController@list');
            Route::get('', 'ShowController@index')->name('show.index')->middleWare('permission:' . PermissionGroup::Show . ', Show list of shows');
            Route::get('{id}', 'ShowController@show')->name('show.show')->middleWare('permission:' . PermissionGroup::Show . ', Show specific show');
            Route::post('', 'ShowController@store')->name('show.store')->middleWare('permission:' . PermissionGroup::Show . ', Store specific show');
            Route::put('{id}', 'ShowController@update')->name('show.update')->middleWare('permission:' . PermissionGroup::Show . ', Update specific show');
            Route::delete('{id}', 'ShowController@destroy')->name('show.destroy')->middleWare('permission:' . PermissionGroup::Show . ', Destroy specific show');
        });

        /**
         *  Revisions
         */
        Route::group(['prefix' => 'revisions'], function () {
            Route::get('{id}', 'RevisionController@show')->name('revision.show')->middleWare('permission:' . PermissionGroup::Revision . ', Get list of revision');
        });

        /**
         *  EPG
         */
        Route::group(['prefix' => 'epg'], function () {
            Route::post('import', 'EPGController@import')->name('epg.import')->middleWare('permission:' . PermissionGroup::EPG . ', EPG import');
        });

        /**
         *  Programs CRUD
         */
        Route::group(['prefix' => 'programs'], function () {
            Route::get('types/accessible-list', 'ProgramController@list');
            Route::get('types', 'ProgramController@types')->name('program.types')->middleWare('permission:' . PermissionGroup::Program . ', Get list of program types');
            Route::get('', 'ProgramController@index')->name('program.index')->middleWare('permission:' . PermissionGroup::Program . ', Get list of program');
            Route::get('{id}', 'ProgramController@show')->name('program.show')->middleWare('permission:' . PermissionGroup::Program . ', Show specific program');
            Route::post('', 'ProgramController@store')->name('program.store')->middleWare('permission:' . PermissionGroup::Program . ', Store specific program');
            Route::put('{id}', 'ProgramController@update')->name('program.update')->middleWare('permission:' . PermissionGroup::Program . ', Update specific program');
            Route::delete('{id}', 'ProgramController@destroy')->name('program.destroy')->middleWare('permission:' . PermissionGroup::Program . ', Destroy specific program');
        });

        /**
         *  Cache
         */
        Route::group(['prefix' => 'cache'], function () {
            Route::post('clear', 'CacheController@clear')->name('cache.clear');
        });

        /**
         *  Playlists CRUD
         */
        Route::group(['prefix' => 'playlists'], function () {
            Route::get('accessible-list', 'PlaylistController@list');
            Route::get('', 'PlaylistController@index')->name('playlist.index')->middleWare('permission:' . PermissionGroup::Playlist . ', Get list of playlists');
            Route::get('{id}', 'PlaylistController@show')->name('playlist.show')->middleWare('permission:' . PermissionGroup::Playlist . ', Show specific playlist');
            Route::post('', 'PlaylistController@store')->name('playlist.store')->middleWare('permission:' . PermissionGroup::Playlist . ', Store specific playlist');
            Route::put('{id}', 'PlaylistController@update')->name('playlist.update')->middleWare('permission:' . PermissionGroup::Playlist . ', Update specific playlist');
            Route::delete('{id}', 'PlaylistController@destroy')->name('playlist.destroy')->middleWare('permission:' . PermissionGroup::Playlist . ', Destroy specific playlist');
            Route::post('restore/{id}', 'PlaylistController@restore')->name('playlist.restore')->middleWare('permission:' . PermissionGroup::Playlist . ', Restore specific playlist');
            Route::post('{id}/order-assets', 'PlaylistController@orderAssets')->name('playlist.order-assets')->middleWare('permission:' . PermissionGroup::Playlist . ', Sort assets in specific playlist');
        });


        /**
         *  Release information
         */

        Route::group(['prefix' => 'release'], function () {
            Route::get('info', 'ReleaseController@information');
        });
    });
});
