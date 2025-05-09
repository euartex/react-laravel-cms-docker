<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTtlToLivefeedTokensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('livefeed_tokens', function (Blueprint $table) {
            $table->string('token',100);
            $table->dateTime('ttl');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('livefeed_tokens', function (Blueprint $table) {
            $table->dropColumn(['ttl','token']);
        });
    }
}
