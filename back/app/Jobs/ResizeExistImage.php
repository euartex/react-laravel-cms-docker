<?php

namespace App\Jobs;

use App\Upload;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Services\StorageService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class ResizeExistImage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $upload;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Upload $upload)
    {
        $this->queue = 'resize-exist-image';
        $this->upload = $upload;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(StorageService $storageService)
    {
        try {
            $dataUpload = $this->upload->getUploadDataByOriginalUrl();
            $filename = uniqid();
            $tempImage = tempnam(sys_get_temp_dir(), $filename);
            copy($this->upload->original, $tempImage);

            $uploaded_file = new UploadedFile($tempImage, $filename);
            $storageService->saveTmpImageAsset($uploaded_file, $dataUpload['instance_id'], $dataUpload['instance_upload_type'], $this->upload->id, 'public', $dataUpload['instance']);
        } catch (\Exception $exception) {
            Log::info('Error resize exist image job');
            Log::debug($exception);
        }

    }
}
