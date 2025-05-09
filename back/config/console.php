<?php

return [
    'watchDirectory' => env('CONSOLE_WATCH_DIRECTORY', '/opt/p1media/projectsV2'),
    'mezaninneDirectory' => env('MEZANINNE_PATH', '/opt/p1media/mezaninneV2'),

     /*
    |--------------------------------------------------------------------------
    | EPG
    |--------------------------------------------------------------------------
    |
    | This value is the day, after witch programs and show will be destroyed
    |
    */
    'epg_timeout' => env('EPG_TIMEOUT', 2), //Days after show end
];
