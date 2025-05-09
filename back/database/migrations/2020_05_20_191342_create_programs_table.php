<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use App\Enums\ProgramType;

class CreateProgramsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('programs', function(Blueprint $table)
		{
			$table->id();
			$table->string('name', 250);
			$table->dateTime('start_show_at')->nullable();
			$table->dateTime('end_show_at')->nullable();
            $table->enum('type', ProgramType::getValues());

            $table->foreign('show_id')->references('id')->on('shows')->onDelete('cascade');
			$table->bigInteger('show_id')->unsigned()->nullable();

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->bigInteger('project_id')->unsigned();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('programs');
	}

}
