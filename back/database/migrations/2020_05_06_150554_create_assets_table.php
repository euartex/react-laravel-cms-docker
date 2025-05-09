<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\StatusAsset;
use App\Enums\AssetType;

class CreateAssetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('asset_id', 24)->unique('id_asset');
            $table->string('title', 100)->nullable();
            $table->string('description')->nullable();
            $table->string('long_description', 1024)->nullable();
            $table->string('path_mezaninne', 200)->nullable()->comment('Path to original file');
            $table->bigInteger('poster')->unsigned()->nullable();
            $table->foreign('poster')->references('id')->on('uploads')->onDelete('cascade');
            $table->bigInteger('cover')->unsigned()->nullable();
            $table->foreign('cover')->references('id')->on('uploads')->onDelete('cascade');
            $table->string('slug', 500)->nullable()->comment('Used for engine seo optimization');
            $table->string('seo_title', 100)->nullable()->comment('Used for engine seo optimization');
            $table->string('seo_description')->nullable()->comment('Used for engine seo optimization');
            $table->enum('status', StatusAsset::getValues())->default(StatusAsset::Draft);
            $table->enum('type', AssetType::getValues())->default(AssetType::Video);
            $table->string('vdms_id', 50)->nullable();
            $table->foreign('project_id')->references('id')->on('projects');
            $table->bigInteger('project_id')->unsigned();
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->bigInteger('company_id')->unsigned();
            $table->dateTime('start_on')->nullable();
            $table->dateTime('end_on')->nullable();
            $table->timestamp('creation_time_asset')->nullable()->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('published_at')->nullable();
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
        Schema::dropIfExists('assets');
    }
}
