<?php

use Illuminate\Database\Seeder;
use App\NavigationType;

class NavigationTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $types = [
            array('name' => 'Home', 'slug' => 'home'),
            array('name' => 'Whats on', 'slug' => 'whats-on'),
            array('name' => 'Playlists', 'slug' => 'playlists'),
            array('name' => 'Topics', 'slug' => 'topics'),
            array('name' => 'Favorites', 'slug' => 'favorites'),
            array('name' => 'Search', 'slug' => 'search'),
            array('name' => 'Settings', 'slug' => 'settings'),
            array('name' => 'Exit', 'slug' => 'exit'),
        ];

        foreach ($types as $type) {
            NavigationType::create([
                'name' => $type['name'],
                'slug' => $type['slug'],
                'is_allow_playlists' => true
            ]);
        }
    }
}
