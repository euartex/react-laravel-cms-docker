<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use App\Enums\NavigationType;

class CreateNavigationTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('navigations', function(Blueprint $table)
		{
			$table->bigIncrements('id')->unsigned();

			$table->string('title',100)->nullable();
            $table->string('cms_title',100)->nullable();

            $table->string('slug',200)->nullable();

            $table->string('seo_title',100)->nullable();
            $table->string('seo_description',500)->nullable();

            $table->foreign('type_id')->references('id')->on('navigation_types');
            $table->bigInteger('type_id')->unsigned()->nullable();

            $table->foreign('project_id')->references('id')->on('projects');
            $table->bigInteger('project_id')->unsigned();

            $table->integer('order')->unsigned();


			/*$table->integer('menu_type')->nullable()->index('fk_navigation_menu_type')->comment('1- VOD
2- Settings
3- Favourites
4- Search');*/
			//$table->string('cms_title')->nullable();
			//$table->integer('region')->nullable();
			//$table->string('language')->nullable()->comment('ISO 3166-2');
			//$table->integer('ordering')->nullable();
			//$table->string('icon_path',200)->nullable();
			//$table->string('icon_focus_path',200)->nullable();
			//$table->string('tv')->nullable();
			//$table->string('tablet_x1')->nullable();
			//$table->string('tablet_x2')->nullable();
			//$table->bigInteger('icon_focus_id')->unsigned();
            //$table->foreign('icon_focus_id')->references('id')->on('uploads');
            //$table->bigInteger('icon_upload_id')->unsigned();
            //$table->foreign('icon_upload_id')->references('id')->on('uploads');
			//$table->dateTime('start_date')->nullable();
			//$table->dateTime('end_date')->nullable();
			$table->string('description',500)->nullable();

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
		Schema::drop('navigations');
	}

}
