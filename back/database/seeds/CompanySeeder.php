<?php

use JeroenZwart\CsvSeeder\CsvSeeder;
use App\Company;

class CompanySeeder extends CsvSeeder
{

    public $companies_full;

    public function __construct()
    {

        $this->header = false;
        $this->tablename = 'companies';
        $this->delimiter = ';';
        $this->file = base_path() . '/database/seeds/csvs/companies.csv';
        $this->companies_full = base_path() . '/database/seeds/csvs/companies_full.csv';
        $this->truncate = false;

        $this->mapping = [
            'company_id',
            'created_at',
            'address',
            'zip',
            'country',
            'phone',
            'email',
            'name',
            'auto_published'
        ];
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        config(['seeding' => true]);

        //$this->removeExistCompanies();

        // Recommended when importing larger CSVs
        DB::disableQueryLog();

        parent::run();

        config(['seeding' => false]);
    }


    public function removeExistCompanies()
    {
        $csv = new ParseCsv\Csv();
        $csv->sort_by = 'id_company';
        $csv->delimiter = ';';
        $csv->parse($this->companies_full);


        foreach ($csv->data as $i => $row) {
            if (isset($row['id_company']) && $row['id_company'] != null) {
                $company = Company::whereCompanyId($row['id_company'])->first();
                //If company already exist update auto_publish
                if ($company) {
                    $company->auto_published = $row['auto_published'];
                    if ($company->save()) {
                        //Remove from csv (To avoid duplicate entry content)
                        unset($csv->data[$i]);
                    }
                }
            }
        }

        $csv->heading = false;
        $csv->save($this->file);
    }
}
