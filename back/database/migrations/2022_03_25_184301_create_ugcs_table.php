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
        if (!Schema::hasTable('ugcs')) {
            Schema::create('ugcs', function (Blueprint $table) {
                $table->id();
                $table->string('url');
                $table->enum('type', ['photo', 'video']);
                $table->string('title');
                $table->text('description');
                $table->string('first_name');
                $table->string('last_name');
                $table->string('email');
                $table->string('phone');
                $table->string('playlist_id', 50);
                $table->string('device_type_slug', 50);
                $table->enum('status', ['pending', 'archived', 'rejected']);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ugcs');
    }
}
