<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Livefeed;
use Illuminate\Support\Str;
use Faker\Generator as Faker;

$factory->define(Livefeed::class, function (Faker $faker) {
    return [
        'name' => $faker->word,
        'description' => $faker->word,
        'url' => $faker->url,
        'project_id' => 1,
        'livefeed_id' => Str::random(16)
    ];
});
