<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateUserTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('users', function(Blueprint $table)
		{
			$table->bigIncrements('id')->unsigned();
			$table->string('email', 100)->nullable()->unique();
			$table->string('first_name', 45)->nullable();
			$table->string('last_name', 45)->nullable();
			$table->string('password', 500)->nullable();
			$table->timestamp('email_verified_at')->nullable();
            $table->boolean('newsletter')->nullable();
            $table->json('meta')->nullable();
            //$table->integer('external_id')->nullable()->comment('For WP synchronization'); //Added as the new migration
            $table->timestamp('last_login_at')->nullable()->comment('Just for csv import from old site. Does not use in current system');
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
		Schema::drop('users');
	}

}
