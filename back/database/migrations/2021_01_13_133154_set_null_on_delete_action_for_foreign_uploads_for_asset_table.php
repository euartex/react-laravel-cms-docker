<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SetNullOnDeleteActionForForeignUploadsForAssetTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('assets', function (Blueprint $table) {

            $table->dropForeign(['poster']);
            $table->foreign('poster')->references('id')->on('uploads')->onDelete('SET NULL');

            $table->dropForeign(['cover']);
            $table->foreign('cover')->references('id')->on('uploads')->onDelete('SET NULL');
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

            $table->dropForeign(['poster']);
            $table->foreign('poster')->references('id')->on('uploads')->onDelete('cascade');

            $table->dropForeign(['cover']);
            $table->foreign('cover')->references('id')->on('uploads')->onDelete('cascade');
        });
    }
}
