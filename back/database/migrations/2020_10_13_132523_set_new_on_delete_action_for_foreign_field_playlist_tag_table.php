<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SetNewOnDeleteActionForForeignFieldPlaylistTagTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('playlist_tag', function (Blueprint $table) {

            $table->dropForeign(['tag_id']); 

            $table->foreign('tag_id')->references('id')->on('tags')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('playlist_tag', function (Blueprint $table) {

            $table->dropForeign(['tag_id']); 

            $table->foreign('tag_id')->references('id')->on('tags');
        });
    }
}
