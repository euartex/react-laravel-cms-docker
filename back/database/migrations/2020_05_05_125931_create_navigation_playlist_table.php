<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNavigationPlaylistTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('navigation_playlist', function (Blueprint $table) {
            $table->id();

            $table->foreign('navigation_id')->references('id')->on('navigations');
            $table->bigInteger('navigation_id')->unsigned();

            $table->foreign('playlist_id')->references('id')->on('playlists');
            $table->bigInteger('playlist_id')->unsigned();

            $table->integer('order')->unsigned();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('navigation_playlist');
    }
}
