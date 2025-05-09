<?php

use App\Services\StorageService;
use Illuminate\Database\Seeder;
use App\Upload;
use App\Jobs\ResizeExistImage;

class ResizeImageFixSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */

    public function run()
    {
        Upload::All()->each(function ($upload) {
            ResizeExistImage::dispatch($upload);
        });
    }
}
