<?php

use Illuminate\Database\Seeder;
use App\Asset;
use App\Upload;
use Carbon\Carbon;

class AssetUploadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $path = base_path().'/database/seeds/dummy/assets';

        Asset::All()->each(function ($asset, $key) use ($path) {

            //Todo only for demo
            $img = $key + 1;

            //Also update publish time
            $asset->published_at = Carbon::now()->toDateTimeString();

            //$poster = factory(Upload::class)->make(['hash' => $asset->asset_id, 'instance' => 'asset','url' => $path.'/'.$img.'.jpg']);
            $cover = factory(Upload::class)->make(['hash' => $asset->asset_id, 'instance' => 'asset', 'url' => $path.'/'.$img.'.jpg']);
           // $asset->poster()->associate($poster);
            $asset->cover()->associate($cover);

            $asset->save();
        });

    }
}
