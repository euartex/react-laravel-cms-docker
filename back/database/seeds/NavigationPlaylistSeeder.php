<?php

use Illuminate\Database\Seeder;
use App\Playlist;
use App\Navigation;

class NavigationPlaylistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        Navigation::All()->each(function ($navigation){

            //Attach is top to Home
            if($navigation->type->id == 1)  if($playlist = Playlist::where('is_top',true)->first()) $navigation->playlists()->syncWithoutDetaching([$playlist->id => ['order' => 1]]);

            //Attach is top to News
            if($navigation->type->id == 3)  if($playlist = Playlist::where('is_top',true)->first()) $navigation->playlists()->syncWithoutDetaching([$playlist->id => ['order' => 1]]);


            $count = Playlist::all()->count();
            if($navigation->type->id == 1 || ($navigation->type->id == 3 && strtolower($navigation->title) != 'news') || $navigation->type->id == 4 ) {

                for ($i = 1; $i <= $count; $i++) {
                    
                    if($playlist = Playlist::find($i)) $navigation->playlists()->syncWithoutDetaching([$playlist->id => ['order' => $i + 1]]);
                }

            }

        });
    }
}
