<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use App\Upload;
use Exception;
use App\DeviceType;
use Image;
use Illuminate\Support\Facades\Storage;


class ImageResize implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $upload;

    public $tries = 5;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * @var int
     */
    public $retryAfter = 10;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Upload $upload)
    {
        $this->queue = 'image-resize';
        $this->upload = $upload;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $upload = $this->upload;

        $result = DeviceType::all()->map(function ($device_type) use ($upload): Object{

            $device_sizes = collect([
                ['small' => [
                    'width'  => intval (explode('x',$device_type->small)[0] ?? 0),
                    'height' => intval (explode('x',$device_type->small)[1] ?? 0),
                ]],
                ['medium' => [
                    'width'  => intval (explode('x',$device_type->medium)[0] ?? 0),
                    'height' => intval (explode('x',$device_type->medium)[1] ?? 0),
                ]],
                ['large' => [
                    'width'  => intval (explode('x',$device_type->large)[0] ?? 0),
                    'height' => intval (explode('x',$device_type->large)[1] ?? 0),
                ]],
                ['original' => [
                    'width'  => 0,
                    'height' => 0,
                ]],
            ]);

            $uploaded = $device_sizes->map(function ($size)  use ($upload, $device_type): Array{

                /**
                *   Path for uploads row
                */
                $path_for_upload_row = str_replace(basename($upload->tmp), key($size), $upload->tmp) . '/' . basename($upload->tmp);


                /**
                *    Cloud file path
                */
                $cloud_file_path = $upload->uploadPathByTemplate($device_type->slug) . $path_for_upload_row;


                /**
                *   Size prepare
                */
                $width = $size[key($size)]['width'] ?? 0;
                $height = $size[key($size)]['height'] ?? 0;


                /**
                *   Open file a image resource
                */
                if (filter_var($upload->tmp, FILTER_VALIDATE_URL)) {

                    $image = Image::make($upload->tmp);
                }else {

                    $image = Image::make(storage_path('app/public/' . $upload->tmp));
                }


                /**
                *   If not original
                */
                if($height > 0 and $width > 0){

 
                    /**
                    *   Resize the image relatively bigger side
                    */
                    $image->resize((($width < $height) ?  $width : ''), (($height < $width) ?  $height : ''), function ($constraint) {

                        $constraint->aspectRatio();
                    });

 
                    /**
                    *   Cropping
                    */
                    $image->crop($width, $height)->encode('jpg');
                }

                /**
                *   Upload croped image to storage
                */
                $stored = Storage::disk(config('filesystems.cloud'))->put($cloud_file_path, $image->stream());


                return [key($size) => $path_for_upload_row];
            });

            return $uploaded;
        });

        /**
        *    Delete uploaded file
        */
        $upload->destroyTmpFile();


        /**
        *   Update upload row
        */
        $upload->saveNewPath($result->first());
    }
 

    /*
    * Execute the job.
    *
    * @return void
    */
   public function failed(Exception $exception)
   {
        Log::info('failed image resize');
        Log::debug($exception->getMessage());
   }
}
