<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNavigationDeviceTypeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('navigation_device_type', function (Blueprint $table) {

            $table->id();

            $table->foreign('navigation_id')->references('id')->on('navigations')->onDelete('cascade');
            $table->bigInteger('navigation_id')->unsigned();

            $table->foreign('device_type_id')->references('id')->on('device_types')->onDelete('cascade');
            $table->bigInteger('device_type_id')->unsigned();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('navigation_device_type');
    }
}
