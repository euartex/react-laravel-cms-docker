<?php

use App\Enums\PermissionAction;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class changeActionFieldToAllowPermissionsRoleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('permission_role', function(Blueprint $table) {
            $table->dropColumn(['actions']);
            $table->boolean('allow')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('permission_role', function(Blueprint $table) {
            $table->dropColumn(['allow']);
            $table->set('actions', PermissionAction::getValues())->nullable();
        });
    }
}