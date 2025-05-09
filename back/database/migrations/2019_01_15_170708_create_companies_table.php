<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCompaniesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('company_id', 50);
            $table->string('name', 100);
            //$table->string('logo')->nullable();
            $table->string('address')->nullable();
            $table->string('zip', 50)->nullable();
            $table->string('country', 100)->nullable();
            $table->string('phone', 100)->nullable();
            $table->string('email', 100)->unique();
            $table->boolean('auto_published')->default(false);

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
        Schema::dropIfExists('companies');
    }
}
