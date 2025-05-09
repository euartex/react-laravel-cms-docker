<?php

use Illuminate\Database\Seeder;
use App\Upload;
use App\DeviceType;

class DeviceTypeUploadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Upload::All()->each(function ($upload){
            $upload->deviceType()->saveMany(DeviceType::all()->random(1, count(DeviceType::all())));
        });
    }
}
 