<?php

namespace App\Services;

use Illuminate\Support\Facades\File as Files;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Upload;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Illuminate\Http\File;

class StorageService
{
   protected $config;

   public function __construct($config)
   {
      $this->config = $config;
   }

   /**
     * @param  object  $asset
     *
     * @return bool
   **/
   public function deleteFromMezanine($asset)
   {
      Files::delete($this->config['mezaninne'] . $asset->path_mezaninne);

      return true;
   }

   /**
     * @param  string  $file Instance of File,
     * @param  $path string
     * @param  $disk_name string
     *
     * @return bool
   **/
    public function saveAssetVideoToMezaninne(File $file, $path, $disk_name = 'mezaninne')
    {
      return Storage::disk($disk_name)->putFile($path, $file) ?? false;
    }


    /**
     * @param  $from string
     * @param  $to string
     * @param $disk_name string
     *
     * @return bool
     **/

    public function moveAssetVideoToMezaninne($from, $to)
    {
        return \Illuminate\Support\Facades\File::move($from,$to);
    }


    /**
    *   Upload tmp file with instance of File to uploads for resizing
    *
    *   @param $file instance of File, $instance_id string, $instance_upload_type string (cover, poster...), $id int (id of upload), $disk_name string (s3, public...)
    *
    *   @return Upload model
    */
    public function saveTmpImageAssetFile(File $file,  string $instance_id, string $instance_upload_type,  int $id = null, string $disk_name = 'public'){
      return $this->saveTmpImageAsset($file, $instance_id, $instance_upload_type,  $id, $disk_name);
    }


    /**
    *   Upload tmp file with instance of UploadedFile to uploads for resizing
    *
    *   @param $file instance of UploadedFile, $instance_id string, $instance_upload_type string (cover, poster...), $id int (id of upload), $disk_name string (s3, public...)
    *
    *   @return Upload model
    */
    public function saveTmpImageAssetUploadedFile(UploadedFile $file, string $instance_id, string $instance_upload_type, int $id = null, string $disk_name = 'public'){
      return $this->saveTmpImageAsset($file, $instance_id, $instance_upload_type,  $id, $disk_name);
    }


   /**
    *   Upload tmp file to uploads for resizing
    *
    *   @param $file, $instance_id string, $instance_upload_type string (cover, poster...), $id int (id of upload), $disk_name string (s3, public...)
    *
    *   @return Upload model
    */
    public function saveTmpImageAsset($file, string $instance_id, string $instance_upload_type,  int $id = null, string $disk_name = 'public', string $instance = null){

        $new_upload = new Upload;

        if($tmp_file = Storage::disk($disk_name)->putFile($new_upload->getUploadTempPathByTemplate($instance_upload_type, $instance_id, $instance), $file)){

            if(! $upload = $new_upload->select('id')->find($id)){

                return $new_upload->create(['tmp' => $tmp_file]);
            }else{

                $upload->update(['tmp' => $tmp_file]);


                $upload->fresh();

                return  $upload;
            }
        }

        return false;
    }
}
