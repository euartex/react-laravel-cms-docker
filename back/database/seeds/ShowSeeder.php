<?php

use Illuminate\Database\Seeder;

class ShowSeeder extends Seeder
{
     /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $shows = factory(\App\Show::class, 10)->create();
    }
}
