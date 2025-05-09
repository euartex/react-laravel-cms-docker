<?php

use Illuminate\Database\Seeder;
use App\Project;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $project = Project::create([
            'name' => 'Americas Voice',
            'project_id' => '5ac62a8225e1b',
        ]);

        $project->companies()->sync(\App\Company::all());
    }
}
