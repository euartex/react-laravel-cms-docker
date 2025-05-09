<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Company;
use App\Upload;
use Faker\Generator as Faker;
use App\Helpers\HelperController;


$factory->define(Company::class, function (Faker $faker){

    return [
        'name' => $faker->word,
        'address' => $faker->address,
        'country' => $faker->country,
        'phone' => $faker->phoneNumber,
        'email' => $faker->email,
        'tax_number' => $faker->bankAccountNumber,
        'auto_published' => $faker->boolean,
    ];
});


