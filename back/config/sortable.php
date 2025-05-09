<?php

return [
    'entities' => [
        'static_pages' => ['entity' => '\App\StaticPage'],
        'navigations' => ['entity' => '\App\Navigation'],
        'banners' => ['entity' => '\App\Banner'],
        'navigation_playlists' => [
            'entity' => '\App\Navigation',
            'relation' => 'playlists'
        ],
        'playlist_assets' => [
            'entity' => '\App\Playlist',
            'relation' => 'assets'
        ],
    ],
];