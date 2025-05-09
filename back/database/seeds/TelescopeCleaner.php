<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class TelescopeCleaner extends Seeder
{
    /**
     * Remove all records from telescope tables
     *
     * @return void
     */
    public function run()
    {
        if(Schema::hasTable('telescope_entries'))
            DB::table('telescope_entries')->delete();

        if(Schema::hasTable('telescope_entries_tags'))
            DB::table('telescope_entries_tags')->delete();

        if(Schema::hasTable('telescope_monitoring'))
            DB::table('telescope_monitoring')->delete();

    }
}
