<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;


class CreateDeviceKeysTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('device_keys', function(Blueprint $table)
		{
			$table->bigIncrements('id')->unsigned();
			$table->string('key',4)->unique();
			$table->bigInteger('device_id')->unsigned();
			$table->foreign('device_id')->references('id')->on('devices')->onDelete('cascade');
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
		Schema::drop('device_keys');
	}

}
