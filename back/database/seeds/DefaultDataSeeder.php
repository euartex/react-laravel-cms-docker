<?php

use Illuminate\Database\Seeder;
use App\Company;
use App\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;


class DefaultDataSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        DB::table('companies')->insert([
            'company_id' => 'test_company',
            'name' => 'Test company',
            'email' => 'admin@domain.com',
        ]);

        DB::table('users')->insert([
            'email' => 'admin@domain.com',
            'first_name' => 'Andrey',
            'password' => Hash::make('admin'),
            'email_verified_at' => now()
        ]);

        DB::table('cms_users')->insert([
            'email' => 'admin@domain.com',
            'first_name' => 'Andrey',
            'phone' => '+380999090001',
            'password' => Hash::make('admin'),
            'role_id' => 1,
        ]);

        DB::table('company_user')->insert([
            'company_id' => 1,
           'user_id' => 1
        ]);
    }
}
