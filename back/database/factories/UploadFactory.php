<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Upload;
use App\DeviceType;
use Config as Cnf;
use App\Helpers\HelperController;
use Faker\Generator as Faker;

$factory->define(Upload::class, function (Faker $faker, $attr) {

    $upload = new Upload;

    $file_name = Upload::count() + 1 .'.jpg';

    //$file_name = $faker->regexify('[a-z0-9]{20}') . '.jpg';

    foreach(DeviceType::all() as $device_type){

        foreach([
                    'original' => ['width' => 700,'height' => 450],
                    'large' => ['width' => 500,'height' => 450],
                    'medium' => ['width' => 400,'height' => 350],
                    'small' => ['width' => 230,'height' => 180]] as  $key => $size){

            $path = $upload->uploadPathByTemplate($device_type->slug).$attr['instance'].'/'.$attr['hash'] .'/cover/'. $key .'/';


            if (array_key_exists('url',$attr)) {
                HelperController::saveImage($path . $file_name, $size['width'], $size['height'], $attr['url']);
            }
            else {
                HelperController::saveRandomImage($path . $file_name, $size['width'],$size['height']);
            }
        }
    }

    return $upload->create([
        'original' => $attr['instance'].'/'.$attr['hash'].'/cover/original/'.$file_name,
        'large' => $attr['instance'].'/'.$attr['hash'].'/cover/large/'.$file_name,
        'medium' => $attr['instance'].'/'.$attr['hash'].'/cover/medium/'.$file_name,
        'small' => $attr['instance'].'/'.$attr['hash'].'/cover/small/'.$file_name,
    ])->toArray();
});
