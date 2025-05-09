<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropLivefeedTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {   
        Schema::dropIfExists('livefeed_tag');
        Schema::dropIfExists('livefeeds');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        /**
        *   Create Livefeed table
        */
        Schema::create('livefeeds', function(Blueprint $table)
        {
            $table->bigIncrements('id')->unsigned();
            $table->string('name', 100);
            $table->string('livefeed_id', 20);
            $table->string('url',500)->nullable();
            $table->string('description',500)->nullable();
            $table->bigInteger('logo')->unsigned()->nullable();
            $table->foreign('logo')->references('id')->on('uploads')->onDelete('cascade');
            $table->bigInteger('project_id')->unsigned()->nullable();
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->bigInteger('company_id')->unsigned()->nullable();
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });

        /**
        *   Create Livefeed_tag table
        */
        Schema::create('livefeed_tag', function (Blueprint $table) {
            $table->id();

            $table->foreign('livefeed_id')->references('id')->on('livefeeds')->onDelete('cascade');
            $table->bigInteger('livefeed_id')->unsigned();

            $table->foreign('tag_id')->references('id')->on('tags')->onDelete('cascade');
            $table->bigInteger('tag_id')->unsigned();

            $table->timestamps();
        });
    }
}
