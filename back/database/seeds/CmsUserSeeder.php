<?php

use JeroenZwart\CsvSeeder\CsvSeeder;
use Illuminate\Support\Facades\DB;
use App\Company;
use App\Role;
use Illuminate\Support\Facades\Hash;

class CmsUserSeeder extends CsvSeeder
{
    public $cms_users_full;

    public function __construct()
    {
        $this->tablename = 'cms_users';
        $this->cms_users_full = base_path() . '/database/seeds/csvs/cms_users_full.csv';
        $this->file = base_path() . '/database/seeds/csvs/cms_users.csv';
        $this->truncate = true;
        $this->header = false;
        $this->hashable = [];

        $this->defaults = ['role_id' => 2];

        $this->mapping = [
            1 => 'email',
            2 => 'first_name',
            3 => 'last_name',
            5 => 'password',
            7 => 'phone',
            15 => 'created_at',
            17 => 'company_id',
        ];
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        $this->replaceCompanyHashToId();

        parent::run();

        DB::table('cms_users')->insert([
                'email' => 'admin@domain.com',
                'first_name' => 'Andrey',
                'phone' => '+380999090001',
                'password' => Hash::make('juHuTbzPJva83cLA'),
                //'company_id' => 1,
                'role_id' => 1,
            ]
        );

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }


    public function replaceCompanyHashToId()
    {
        $csv = new ParseCsv\Csv();
        $csv->sort_by = 'id_user';
        $csv->delimiter = ';';
        $csv->parse($this->cms_users_full);


        foreach ($csv->data as $i => $row) {
//            $user = \App\User::whereEmail($row['email'])->first();
//            if($user){
//                unset($csv->data[$i]); continue;
//            }

            if (isset($row['id_company']) && $row['id_company'] != null) {
                $company = Company::whereCompanyId($row['id_company'])->first();
                if ($company) {
                    $csv->data[$i] = array_merge($csv->data[$i], ['id_company' => $company->id]);
                } else {
                    $csv->data[$i] = array_merge($csv->data[$i], ['id_company' => $row['id_company']]);
                }
            }
        }

        $csv->linefeed = "\n";
        $csv->heading = false;
        $csv->save($this->file);
    }
}
