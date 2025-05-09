<?php

use Illuminate\Database\Seeder;
use App\AppUser;
use App\Enums\RatingValue;
use App\Asset;

class AssetRatingSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $assets = Asset::all();

        AppUser::All()->each(function ($user) use ($assets){
            $ids = $assets->random(rand(1,3))->pluck('id')->toArray();
            $data = array();
            foreach ($ids as $id)
            {
                $data[$id] = ['rating_value' => RatingValue::getRandomValue()];
            }

            $user->ratedAssets()->attach($data);
        });

//        AppUser::All()->each(function ($user){
//            $rand = rand(1,5);
//            for ($i = 0; $i <= $rand; $i++) {
//                $user->ratedAssets()->attach([Asset::all()->random(1)->first()->id => ['rating_value' => RatingValue::getRandomValue()]]);
//            }
//        });
    }
}
