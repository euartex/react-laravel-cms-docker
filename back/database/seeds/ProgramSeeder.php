<?php

use Illuminate\Database\Seeder;

class ProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $programs = factory(\App\Program::class, (int)config('seed.countPrograms'))->create();
    }
}
