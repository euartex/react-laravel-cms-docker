<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SetNewOnDeleteActionForForeignFieldRoleIdForCmsUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cms_users', function (Blueprint $table) {

            $table->dropForeign(['role_id']); 

            $table->foreign('role_id')->references('id')->on('roles')->onDelete('SET NULL');
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

            $table->dropForeign(['role_id']); 

            $table->foreign('role_id')->references('id')->on('roles');
        });
    }
}
