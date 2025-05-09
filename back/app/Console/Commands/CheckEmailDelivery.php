<?php

namespace App\Console\Commands;

use App\Mail\TestMail;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class CheckEmailDelivery extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send:email {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send test email to address from signature';

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
        $email = $this->argument('email');
        try{
            Mail::send(new TestMail($email));
            $this->info('Successfully sent');
        }catch(\Exception $e){
            $this->error($e->getMessage());
        }
    }
}
