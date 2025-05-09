<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLivefeedTokensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('livefeed_tokens', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('livefeed_id');
            $table->foreign('livefeed_id')->references('id')->on('assets')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('livefeed_tokens');
    }
}
