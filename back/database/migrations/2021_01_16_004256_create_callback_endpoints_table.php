<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCallbackEndpointsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('callback_endpoints', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('url')->unique();
            $table->string('last_sent_at')->nullable();
            $table->string('last_http_response_code')->nullable();
            $table->json('last_sent_body')->nullable();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('callback_endpoints');
    }
}
