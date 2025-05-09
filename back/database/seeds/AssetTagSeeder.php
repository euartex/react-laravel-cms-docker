<?php

use Illuminate\Database\Seeder;
use App\Asset;
use App\Tag;

class AssetTagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tags = Tag::all();

        Asset::All()->each(function ($asset) use ($tags){
            $asset->tags()->attach(
                $tags->random(rand(1,3))->pluck('id')->toArray()
            );
        });
    }
}
