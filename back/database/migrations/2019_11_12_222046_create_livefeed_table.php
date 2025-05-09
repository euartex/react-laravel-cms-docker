<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateLivefeedTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('livefeeds', function(Blueprint $table)
		{
			$table->bigIncrements('id')->unsigned();
			$table->string('name', 100);
            $table->string('livefeed_id', 20);
			//$table->integer('stationId')->nullable(); // ?
			$table->string('url',500)->nullable();
			$table->string('description',500)->nullable();
			$table->bigInteger('logo')->unsigned()->nullable();
            $table->foreign('logo')->references('id')->on('uploads')->onDelete('cascade');
            $table->bigInteger('project_id')->unsigned()->nullable();
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
			$table->bigInteger('company_id')->unsigned()->nullable();
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
			//$table->string('external_url', 200)->nullable();
			//$table->dateTime('start_on')->nullable();
			//$table->dateTime('end_on')->nullable();
			$table->timestamps();
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
		Schema::drop('livefeeds');
	}

}
