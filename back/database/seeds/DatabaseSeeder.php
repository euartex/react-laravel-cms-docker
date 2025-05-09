<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        //It is needed for correct work of observers
        config(['seeding' => true]);

        Storage::disk('s3')->deleteDirectory('storage/local');

        $this->call(OauthClientSeeder::class);
        $this->call(RoleSeeder::class);
        $this->call(PermissionSeeder::class);
        $this->call(DeviceTypeSeeder::class);
        $this->call(PermissionRoleSeeder::class);

        //Separate default data with csv seeds
        $this->call(DefaultDataSeeder::class);


        //CSV file
        $this->call(CompanySeeder::class);
        //CSV file
        $this->call(AppUserSeeder::class);

        $this->call(ProjectSeeder::class);

        //CSV file
        $this->call(PlaylistSeeder::class);

        //CSV file
        $this->call(AssetSeeder::class);

        $this->call(AssetUploadSeeder::class);

        //CSV file
        //Todo attach company for cms user
        //$this->call(CmsUserSeeder::class);

        //$this->call(LivefeedSeeder::class);
        $this->call(NavigationTypeSeeder::class);
        $this->call(NavigationSeeder::class);
        $this->call(StaticPageSeeder::class);
        $this->call(AssetPlaylistSeeder::class);
        //$this->call(AssetRatingSeeder::class);
        //$this->call(AssetUserFavoriteSeeder::class);
        $this->call(TagSeeder::class);
        $this->call(MetadataSeeder::class);
        $this->call(MetadataTagSeeder::class);
        $this->call(PlaylistTagSeeder::class);
        $this->call(CompanyTagSeeder::class);
        $this->call(AssetTagSeeder::class);
        $this->call(ShowSeeder::class);
        $this->call(ProgramSeeder::class);
        $this->call(NavigationPlaylistSeeder::class);

        /**
         * Callbackendpoint
         */
        $this->call(CallbackEndpointSeeder::class);
        $this->call(CallbackEndpointAdminSeeder::class);

        //It is needed for correct work of observers
        config(['seeding' => false]);
    }
}
