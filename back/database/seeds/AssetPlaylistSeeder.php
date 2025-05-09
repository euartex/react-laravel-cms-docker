<?php

use Illuminate\Database\Seeder;
use App\Playlist;
use App\Asset;

class AssetPlaylistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Playlist::All()->each(function ($playlist){
            //Add assets to playlist
            //$playlist->assets()->saveMany(Asset::all()->random(rand(1,10)));

            $numberOfRandom = rand(1,Asset::count());
            $assetsToPlaylist = Asset::all()->random($numberOfRandom);

            for ($i = 0; $i <= $numberOfRandom - 1; $i++) {
                $playlist->assets()->attach([$assetsToPlaylist->slice($i - 1, 1)->first()->id  => ['order' => $i + 1]]);
            }
        });
    }
}
