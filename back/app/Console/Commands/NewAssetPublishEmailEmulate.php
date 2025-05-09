<?php

namespace App\Console\Commands;

use App\Asset;
use App\Mail\AssetPublished;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class NewAssetPublishEmailEmulate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'asset:publish {id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command to check new asset publish email';

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
        $asset = Asset::findOrFail($this->argument('id'));
        if($asset) {
            try {
                Mail::send(new AssetPublished($asset, explode(',', config('mail.to.new_asset_published'))));
                $this->info('Successfully asset publish email');
            } catch (\Exception $e) {
                $this->error($e->getMessage());
            }
        }
    }
}
