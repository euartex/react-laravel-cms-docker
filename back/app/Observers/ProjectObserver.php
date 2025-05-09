<?php

namespace App\Observers;
use App\Helpers\HelperObserver;
use App\Project;

class ProjectObserver
{

    /**
     * Handle the project "creating" event.
     *
     * @param \App\Project $project
     * @return void
     */
    public function creating(Project $project)
    {
        if (config('seeding') === false)
            $project->project_id = unique_random(new Project, 'project_id', 15);
    }
}
