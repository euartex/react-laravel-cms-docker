<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SetPrimaryNavigationDeviceTypeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('navigation_device_type', function (Blueprint $table) {
            $table->dropColumn(['id']);
            $table->primary(['device_type_id', 'navigation_id']); 
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('navigation_device_type', function (Blueprint $table) {
            $table->dropPrimary();
        });
    }
}
