<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Navigation;
use App\NavigationType;
use Faker\Generator as Faker;

$factory->define(Navigation::class, function (Faker $faker) {
    return [
        'title' => $faker->word,
        'cms_title' => $faker->word,
        'order' => $faker->unique()->numberBetween($min = 1, $max = 50),
        //'slug' => $faker->slug,
        'type_id' => NavigationType::all()->random(1)->first()->id,
        'project_id' => 1,
        'description' => $faker->text()
    ];
});
