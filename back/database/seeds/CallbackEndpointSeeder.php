<?php

use Illuminate\Database\Seeder;
use App\CallbackEndpoint;

class CallbackEndpointSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //factory(CallbackEndpoint::class, 10)->create();

        CallbackEndpoint::create([
            'url' => config('app.url') . '/api/v1/callback/debug'
        ]);
    }
}
