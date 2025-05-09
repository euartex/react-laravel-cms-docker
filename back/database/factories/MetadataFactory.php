<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Metadata;
use Faker\Generator as Faker;

$factory->define(Metadata::class, function (Faker $faker) {
    return [
        'name' => $faker->words(3,true),
    ];
});
