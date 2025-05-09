<?php

/**
*   This command clearing old programs with shows by relationships
*/

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Program;
use Config;


class EpgCleaner extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'epg:clean';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Old epg cleaner';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
     
        $this->info('Deleted: ' . Program::whereDate('end_show_at', '<=', now()->add(-Config::get('console.epg_timeout'), 'days')->toDateTimeString())->delete());
    }
}
