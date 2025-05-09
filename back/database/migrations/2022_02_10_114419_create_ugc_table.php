<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUgcTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('device_types', function (Blueprint $table) {
            $table->index('slug');
        });

        Schema::create('ugcs', function (Blueprint $table) {
            $table->id();
            $table->string('url');
            $table->string('title');
            $table->text('description');
            $table->string('name');
            $table->string('surname');
            $table->string('email');
            $table->string('phone');
            $table->unsignedBigInteger('playlist_id');
            $table->foreign('playlist_id')->references('id')->on('playlists')->onDelete('cascade');
            $table->string('device_type_slug', 50);
            $table->foreign('device_type_slug')->references('slug')->on('device_types')->onDelete('cascade');
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
        Schema::table('device_types', function (Blueprint $table)
        {
            $table->dropIndex(['slug']);
        });

        Schema::dropIfExists('ugcs');
    }
}
