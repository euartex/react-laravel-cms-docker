<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SetPrimaryCompanyTagTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('company_tag', function (Blueprint $table) {
            $table->dropColumn(['id']);
            $table->primary(['company_id', 'tag_id']); 
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('company_tag', function (Blueprint $table) {
            $table->dropPrimary();
        });
    }
}
