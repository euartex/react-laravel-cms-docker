<?php

namespace App\Console\Commands;

use App\CallbackEndpoint;
use App\Jobs\SendClearCacheCallbackToUrl;
use Illuminate\Console\Command;
use App\Callback;


class FreshCacheEntityCallback extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send:clearCacheEntity
                            {type : The model name}
                            {id : ID model}
                            {action : Create,Update,Delete}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send PostBack change model to all urls in database';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        /**
         * New callback dispatch to job
         */
        $callback = new Callback();
        $callback->setId($this->argument('id'));
        $callback->setType($this->argument('type'));
        $callback->setAction($this->argument('action'));


        $callbackEndpoints = CallbackEndpoint::all();

        foreach ($callbackEndpoints as $endpoint)  dispatch((new SendClearCacheCallbackToUrl($endpoint, $callback)));

    }
}
