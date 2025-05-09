<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SetNewOnDeleteActionForForeignFieldCompanyIdForCmsUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cms_users', function (Blueprint $table) {

            $table->dropForeign(['company_id']); 

            $table->foreign('company_id')->references('id')->on('companies')->onDelete('SET NULL');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cms_users', function (Blueprint $table) {

            $table->dropForeign(['company_id']); 

            $table->foreign('company_id')->references('id')->on('companies');
        });
    }
}
