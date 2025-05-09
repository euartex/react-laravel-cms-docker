<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropNavigationTagTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('navigation_tag');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        /**
         *   Create navigation_tag table
         */
        Schema::create('navigation_tag', function (Blueprint $table) {
            $table->id();

            $table->foreign('navigation_id')->references('id')->on('navigations')->onDelete('cascade');
            $table->bigInteger('navigation_id')->unsigned();

            $table->foreign('tag_id')->references('id')->on('tags')->onDelete('cascade');
            $table->bigInteger('tag_id')->unsigned();

            $table->timestamps();
        });
    }
}
