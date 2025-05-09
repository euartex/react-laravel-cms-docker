<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Program;
use App\Show;
use App\Enums\ProgramType;
use Carbon\Carbon;

use Faker\Generator as Faker;

$dir = base_path() . '/database/seeds/dummy/assets';

$factory->define(Program::class, function (Faker $faker) {

    $date = Carbon::createFromTimeStamp($faker->dateTimeBetween('-7 days', '+7 days')->getTimestamp());
    $start = $date->addHours(rand(1, 10));
    $end = Carbon::parse($start)->addMinutes(rand(60, 300));

    return [
        'name' => $faker->text(),
        'start_show_at' => $start->toDateTimeString(),
        'end_show_at' => $end->toDateTimeString(),
        'type' => ProgramType::getRandomValue(),
        'show_id' => Show::all()->random(1)->first()->id,
        'project_id' => 1,
    ];
});
