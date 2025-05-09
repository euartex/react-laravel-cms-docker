<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\App;


class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        '\App\Console\Commands\watch',
        '\App\Console\Commands\EpgCleaner',
        '\App\Console\Commands\CheckAssetsAvailabilityVDMS',
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        /**
        *   If production env
        */
	    if (App::environment(['production']))  $schedule->command('watch')->everyMinute();

        /**
        *   For all instances
        */

        $schedule->command('check:vdms')->everySixHours(); //EPG cleaner. Delete for old EPG

        //$schedule->command('epg:clean')->hourly(); //EPG cleaner. Delete for old EPG


        //->sendOutputTo('watchJob_' . now() . '.log');
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
