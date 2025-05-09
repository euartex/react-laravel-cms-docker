<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeFieldsTypeForAssetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('assets', function (Blueprint $table) {
            $table->text('description')->nullable()->change();
            $table->text('long_description')->nullable()->change();
            $table->string('title', 255)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('assets', function (Blueprint $table) {
            $table->string('description', 255)->nullable()->change();
            $table->string('long_description', 500)->nullable()->change();
            $table->string('title', 100)->nullable()->change();
        });
    }
}
