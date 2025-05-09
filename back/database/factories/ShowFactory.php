<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Show;
use App\Playlist;
use Faker\Generator as Faker;

$factory->define(Show::class, function (Faker $faker) {
    return [
        'description' =>  $faker->text(300),
        'title' => $faker->text(80),
        'playlist_id' => Playlist::all()->random(1)->first()->id,
    ];
});
