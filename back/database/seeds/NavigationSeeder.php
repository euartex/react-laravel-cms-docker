<?php

use Illuminate\Database\Seeder;
use App\Navigation;
use App\NavigationType;

class NavigationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //$navigations = factory(\App\Navigation::class, 30)->create();

        $navs = [
            array('title' => 'Home', 'type_slug' => 'home' , 'order' => 1),
            array('title' => 'What\'s on', 'type_slug' => 'whats-on', 'order' => 2),
            array('title' => 'News', 'type_slug' => 'playlists', 'order' => 3),
            array('title' => 'Shows', 'type_slug' => 'playlists', 'order' => 4),
            array('title' => 'Topics', 'type_slug' => 'topics', 'order' => 5),
            array('title' => 'Favorites', 'type_slug' => 'favorites', 'order' => 6),
            array('title' => 'Search', 'type_slug' => 'search', 'order' => 7),
            array('title' => 'Settings', 'type_slug' => 'settings', 'order' => 8),
            array('title' => 'Exit', 'type_slug' => 'exit', 'order' => 9),
        ];

        foreach ($navs as $nav) {
            Navigation::create([
                'title' => $nav['title'],
                'cms_title' => $nav['title'],
                'order' => $nav['order'],
                'type_id' => NavigationType::whereSlug($nav['type_slug'])->first()->id,
                'project_id' => 1,
                'description' => 'Description'
            ]);
        }
    }
}
