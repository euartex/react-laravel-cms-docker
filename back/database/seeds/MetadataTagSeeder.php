<?php

use Illuminate\Database\Seeder;
use App\Metadata;
use App\Tag;

class MetadataTagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $tags = Tag::all();

        Metadata::All()->each(function ($metadata) use ($tags){
            $metadata->tags()->attach(
                $tags->random(rand(1,3))->pluck('id')->toArray()
            );
        });
    }
}
