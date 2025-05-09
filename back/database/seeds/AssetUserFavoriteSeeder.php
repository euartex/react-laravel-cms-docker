<?php

use Illuminate\Database\Seeder;
use App\User;
use App\Asset;


class AssetUserFavoriteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::All()->each(function ($user){
            $user->favorites()->saveMany(Asset::all()->random(rand(1,Asset::count())));
        });
    }
}
