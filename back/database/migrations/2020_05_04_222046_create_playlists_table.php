<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreatePlaylistsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('playlists', function(Blueprint $table)
		{
			$table->bigIncrements('id')->unsigned();
			$table->string('name', 300);
			$table->string('description', 500)->nullable();
			$table->string('playlist_id',50)->unique();
            $table->string('slug',300)->nullable();
            $table->bigInteger('project_id')->unsigned()->nullable();
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->bigInteger('poster_id')->unsigned()->nullable();
            $table->foreign('poster_id')->references('id')->on('uploads')->onDelete('cascade');

            $table->bigInteger('cover_id')->unsigned()->nullable();
            $table->foreign('cover_id')->references('id')->on('uploads')->onDelete('cascade');
            $table->boolean('is_top')->default(false);
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
		Schema::drop('playlists');
	}

}
