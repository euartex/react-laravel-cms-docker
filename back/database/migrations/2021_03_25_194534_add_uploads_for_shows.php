<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUploadsForShows extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {   Schema::table('shows', function (Blueprint $table) {
            $table->bigInteger('poster')->unsigned()->nullable();
            $table->foreign('poster')->references('id')->on('uploads')->onDelete('cascade');
            $table->bigInteger('cover')->unsigned()->nullable();
            $table->foreign('cover')->references('id')->on('uploads')->onDelete('cascade');
            $table->string('slug')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('shows', function (Blueprint $table) {

            $table->dropForeign(['poster']);
            $table->foreign('poster')->references('id')->on('uploads')->onDelete('cascade');
            $table->dropForeign(['cover']);
            $table->foreign('cover')->references('id')->on('uploads')->onDelete('cascade');
        });
    }
}
