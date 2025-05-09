<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Asset;
use App\Enums\StatusAsset;
use Illuminate\Support\Str;
use App\Company;
use App\Upload;
use Faker\Generator as Faker;

$factory->define(Asset::class, function (Faker $faker) {
    $asset_id = Str::random(16);

    return [
        'asset_id' => $asset_id,
        'title' => $faker->word,
        'description' => $faker->text(),
        'long_description' => $faker->text(500),
        'length' => 1,
        'path_mezaninne' => 'url',
        'poster' =>  factory(Upload::class)->make(['hash' => $asset_id, 'instance' => 'asset'])->id,
        'cover' =>  factory(Upload::class)->make(['hash' => $asset_id, 'instance' => 'asset'])->id,
        'seo_url' => 'slug',
        'seo_title' => 'title',
        'seo_description' => 'desc',
        'status' => StatusAsset::getRandomValue(),
        'vdms_id' => Str::random(16),
        'project_id' => 1,
        'company_id' => Company::all()->random(1)->first()->id,
        'creation_time_asset' => now(),
        'published_at' => now(),
    ];
});
