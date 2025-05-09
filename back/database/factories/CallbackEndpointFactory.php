<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\CallbackEndpoint;
use Faker\Generator as Faker;

$factory->define(CallbackEndpoint::class, function (Faker $faker) {
    return [
        'url' => $faker->url,
    ];
});
