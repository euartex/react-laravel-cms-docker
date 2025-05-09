<?php

use Illuminate\Database\Seeder;
use App\OauthClient;
use Config as Cnf;

class OauthClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        OauthClient::create([
            'name' => 'Client P1-API',
            'secret' => 'ETPm7m3e0RicCKnidjzHe7xUTHcW7Yih4603BHx9',
            'redirect' => Cnf::get('app.client_api_url').'/auth/callback',
            'password_client' => 1,
            'personal_access_client' => 0,
            'revoked' => 0
        ]);

        OauthClient::create([
            'name' => 'Client P1CMS-API',
            'secret' => 'ySjJtJFLTogeSyuWm8OpZdSflqGEUPlJNJJhAl6r',
            'redirect' => Cnf::get('app.url').'/auth/callback',
            'password_client' => 1,
            'personal_access_client' => 0,
            'revoked' => 0
        ]);
    }
}
