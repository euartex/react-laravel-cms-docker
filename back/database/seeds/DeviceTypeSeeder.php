<?php

use Illuminate\Database\Seeder;
use App\DeviceType;

class DeviceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    	$deviceTypesArr = [
            array('name' => 'Apple TV','slug' => 'apple-tv', 'large' => '1920x1080', 'medium' => '800x450', 'small' => '355x200'),
            array('name' => 'Android TV','slug' => 'android-tv', 'large' => '1920x1080', 'medium' => '800x450', 'small' => '355x200'),
            array('name' => 'iOS','slug' => 'ios', 'large' => '1920x1080', 'medium' => '800x450', 'small' => '355x200'),
            array('name' => 'Android','slug' => 'android', 'large' => '1920x1080', 'medium' => '800x450', 'small' => '355x200'),
            array('name' => 'Roku','slug' => 'roku', 'large' => '1920x1080', 'medium' => '800x450', 'small' => '355x200'),
            array('name' => 'Fire TV','slug' => 'fire-tv', 'large' => '1920x1080', 'medium' => '800x450', 'small' => '355x200'),
            array('name' => 'Web','slug' => 'web', 'large' => '1920x1080', 'medium' => '800x450', 'small' => '355x200'),
    	];

    	foreach($deviceTypesArr as $item){
	        DeviceType::updateOrCreate(['slug' => $item['slug']],[
	            'name' => $item['name'],
                'slug' => $item['slug'],
                'large' => $item['large'],
                'medium' => $item['medium'],
                'small' => $item['small'],
	        ]);
	    }
    }
}
