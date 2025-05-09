<?php

use JeroenZwart\CsvSeeder\CsvSeeder;
use App\AppUser;
use Illuminate\Support\Facades\Hash;

class AppUserSeeder extends CsvSeeder
{

    public function __construct()
    {
        $this->tablename = 'users';
        $this->file = base_path().'/database/seeds/csvs/app_users.csv';

        $this->offset = 9000; // Todo for fast seeding
        $this->truncate = true;
        $this->hashable = [];

        $this->mapping = [
            15 => 'created_at',
            18 => 'last_login_at',
            1 => 'email',
            2 => 'first_name',
            3 => 'last_name',
            5 => 'password',
        ];
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //Gen random users
        //$users = factory(\App\User::class, 50)->create();

        // Recommended when importing larger CSVs
        DB::disableQueryLog();

        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        //Import csv file
        parent::run();

        DB::table('users')->insert([
            'email' => 'admin@domain.com',
            'first_name' => 'Andrey',
            'password' => Hash::make('juHuTbzPJva83cLA'),
            'email_verified_at' => now()
        ]);

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        //Verified email for specific users
        AppUser::where('last_login_at','>=', '2018-12-12 23:59:59')->update(array('email_verified_at' => now()));
    }
}
