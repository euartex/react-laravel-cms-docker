<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SetNewOnDeleteActionForForeignFieldShowIdForProgramsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('programs', function (Blueprint $table) {

            $table->dropForeign(['show_id']); 

            $table->foreign('show_id')->references('id')->on('shows')->nullable()->onDelete('SET NULL');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('programs', function (Blueprint $table) {

            $table->dropForeign(['show_id']); 

            $table->foreign('show_id')->references('id')->on('shows')->onDelete('CASCADE');
        });
    }
}
