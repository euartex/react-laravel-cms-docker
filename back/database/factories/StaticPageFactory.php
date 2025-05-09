<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\StaticPage;
use App\Project;
use Faker\Generator as Faker;

$factory->define(StaticPage::class, function (Faker $faker) {
    return [
        'title' => $faker->word,
        'sub_title' => $faker->word,
        //'slug' => $faker->word,
        'content' => $faker->text(),
        'order' => $faker->unique()->numberBetween($min = 1, $max = 500),
        'project_id' =>  Project::all()->random(1)->first()->id
    ];
});
