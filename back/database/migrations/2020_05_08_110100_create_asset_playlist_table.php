<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAssetPlaylistTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('asset_playlist', function (Blueprint $table) {

            $table->foreign('asset_id')->references('id')->on('assets')->onDelete('cascade');
            $table->bigInteger('asset_id')->unsigned();

            $table->foreign('playlist_id')->references('id')->on('playlists')->onDelete('cascade');
            $table->bigInteger('playlist_id')->unsigned();

            $table->integer('order')->unsigned()->nullable();

            $table->primary(['asset_id', 'playlist_id']); //added the primary keys

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('asset_playlist');
    }
}
