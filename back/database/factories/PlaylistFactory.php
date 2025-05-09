<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Playlist;
use App\Upload;
use App\Project;
use Illuminate\Support\Str;
use Faker\Generator as Faker;

$factory->define(Playlist::class, function (Faker $faker){

    $playlist_id = $faker->regexify('[a-z0-9]{20}');

    return [
        'name' => $faker->word,
        'description' => $faker->word,
        'project_id' =>  Project::all()->random(1)->first()->id,
        'poster' =>  factory(Upload::class)->make(['hash' => $playlist_id, 'instance' => 'playlist'])->id,
        'playlist_id' => $playlist_id,
    ];
});


