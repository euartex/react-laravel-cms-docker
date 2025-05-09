<?php

use App\Asset;
use JeroenZwart\CsvSeeder\CsvSeeder;
use Illuminate\Support\Facades\DB;

class AssetSeeder extends CsvSeeder
{

    public function __construct()
    {
        $this->tablename = 'assets';
        $this->file = base_path(). config('seed.pathCsvs').'/assets.csv';
        $this->truncate = false;
        $this->header = false;

        $this->mapping = [
            0 => 'asset_id',
            1 => 'title',
            2 => 'description',
            3 => 'long_description',
            //4 => 'length',
            7 => 'path_mezaninne',
            14 => 'status',
            15 => 'vdms_id',
            16 => 'project_id',
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

        //Dummy data
        //$assets = factory(\App\Asset::class, 50)->create();

        // Recommended when importing larger CSVs
        DB::disableQueryLog();

        parent::run();
    }
}
