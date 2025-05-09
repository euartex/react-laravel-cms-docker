<?php

use Illuminate\Database\Seeder;
use App\Company;
use App\Tag;

class CompanyTagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tags = Tag::all();

        Company::All()->each(function ($company) use ($tags){
            $company->meta_tags()->attach(
                $tags->random(rand(1,3))->pluck('id')->toArray()
            );
        });
    }
}
