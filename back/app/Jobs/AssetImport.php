<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\AssetRequest;
use App\Http\Controllers\API\v1\AssetController;
use App\Asset;
use App\Services\StorageService;
use App\Helpers\HelperController;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile; 
use App\Enums\CrudAction;


class AssetImport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $assetImport;
    protected $storageService;

    public $tries = 2;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Array $assetImport,  StorageService $storageService)
    {
        $this->assetImport = $assetImport;
        $this->storageService = $storageService;
 
    }


    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {  
        if(! $this->assetImport) return $this->failed();

        /**
        *   Varibles
        */
        $uploadedFiles = collect([]);
        $request = new AssetRequest();
        $wpPostId = $this->assetImport['wp_post_id'] ?? null;
        $id = $this->assetImport['id'] ?? null;
        $action = $this->assetImport['action'] ?? null;


        /**
        *   Looking for file in request for asset
        */
        collect($this->assetImport)->each(function ($value, $key) use ($request, $uploadedFiles){
            
            if (isset($value['realPath'])){

                $request->files->set($key, new UploadedFile($value['realPath'], $value['clientOriginalName'], $value['mimeType'], null, true));

                $uploadedFiles[] = config('upload.assetImportTmpFilePath') . '/' . basename($value['realPath']);  
            }  
        });
 
        
        /**
        *   Detect action for importing asset
        */
        switch($action){

            case CrudAction::Destroy:

                if(isset($id)){ 

                    /**
                    *   Deleting asset by id 
                    */
                    (new AssetController())->destroy($request->merge(['ids' => [ $id ]]));
                }else{

                    if(isset($wpPostId)){

                         /**
                        *   Deleting asset by wp_post_id 
                        */
                        if($asset = Asset::whereWpPostId($wpPostId)->without(['poster', 'cover'])->select('id')->first()) (new AssetController())->destroy($request->merge(['ids' => [ $asset->id ]]));
                    }
                }

            break;

            case CrudAction::Save:

                /**
                *   Update asset by wpPostId, using by P1ml plugin for export posts as assets with type = "articles"
                */
                if(! isset($id)){

                    if(isset($wpPostId)){

                        if($asset = Asset::whereWpPostId($wpPostId)->without(['poster', 'cover'])->select('id')->first()){

                            (new AssetController())->update($this->storageService, $request->merge($this->assetImport), $asset->id); 
                        }
                    }
                }else{

                    /**
                    *   Update asset by id
                    */
                    (new AssetController())->update($this->storageService, $request->merge($this->assetImport), $id); 
                }

            break;

            case CrudAction::Store:

                (new AssetController())->store($this->storageService, $request->merge($this->assetImport ));
            break;
        }


        /**
        *   If imported asset has uploaded files,   destroying tmp files for him...
        */
        if($uploadedFiles->isNotEmpty()) if(! Storage::delete($uploadedFiles->toArray())) Log::error('The tmp file(s) for assets import has not been deleted.  Path: ' . config('upload.assetImportTmpFilePath') . 'Something went wrong...');


        return true;
    }


    /*
    * Execute the job.
    *
    * @return void
    */
   public function failed()
   {
        Log::error('failed');

        return false;
   }
}
