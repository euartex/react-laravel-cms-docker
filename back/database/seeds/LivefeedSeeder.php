<?php

use Illuminate\Database\Seeder;
use App\Livefeed;

class LivefeedSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //$livefeeds = factory(\App\Livefeed::class, 100)->create();

        Livefeed::create([
            'name' => 'Main livefeed',
            'description' => 'Decription for main livefeed',
            'url' => 'https://cdnapisec.kaltura.com/p/2377021/sp/0/playManifest/entryId/0_m2pjgwiu/format/applehttp/protocol/http/flavorParamId/301971/manifest.m3u8',
            'project_id' => 1,
            'livefeed_id' => '6LgUJ9hOSNLk8WpB'
        ]);
    }
}
