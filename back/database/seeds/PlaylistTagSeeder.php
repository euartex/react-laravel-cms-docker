<?php

use Illuminate\Database\Seeder;
use App\Playlist;
use App\Tag;

class PlaylistTagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tags = Tag::all();

        Playlist::All()->each(function ($playlist) use ($tags){
            $playlist->meta_tags()->attach(
                $tags->random(rand(1,3))->pluck('id')->toArray()
            );
        });
    }
}
