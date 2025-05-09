<?php

namespace App\Console\Commands;

use App\Enums\StatusAsset;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use App\Company;
use App\Project;
use App\Asset;
use App\Tag;
use App\Jobs\StoreToVDMSJob;
use App\Services\StorageService;
use Illuminate\Http\File;



class Watch extends Command
{

    protected $signature = 'watch';
    protected $description = 'Watches new files from PME.';
    protected $jsonPaths = [];
    const add_top_news_limit = 4;
    const ignore_file_older_than_sec = 3600;


    private function recursive_scan($root)
    {
        $pathinfo = pathinfo($root);

        if(isset($pathinfo['extension']))  if($pathinfo['extension'] === 'json')  $this->jsonPaths[basename(dirname($root))][] = $root;

        // When it's a file or not a valid dir name
        // Print it out and stop recusion
        if (is_file($root) or !is_dir($root))  return;


        // starts the scan
        $dirs = scandir($root);
        foreach ($dirs as $dir) {

            if ($dir == '.' or $dir == '..')  continue; // skip . and ..

            $path = $root . '/' . $dir;

            $this->recursive_scan($path);
        }
    }

    public function handle(StorageService $storageService)
    {
        $watchDirectory = config('console.watchDirectory');

        $this->recursive_scan( $watchDirectory);

        foreach( $this->sortJsonPaths($this->jsonPaths) as $company_list) {
            foreach( $company_list as $key => $json_asset) {

                $this->process($json_asset, $storageService);
            }
        }
    }

    private function sortJsonPaths($paths)
    {
        $sorted_json_list = array();

        foreach($paths as $folder_name => $assets_set_company) {

            $company_array = array();

            foreach($assets_set_company as $path) {

                $content = file_get_contents($path);
                $json = json_decode($content, true);

                $key_name = $json['order_asset'];

                if( !file_exists(dirname($path) .'/'. $json['video']['file_path'])) { // we check that file from the list exists, we check it exits using json->video below...
                    continue;
                }

                $company_array[$key_name] = $path;
            }

            ksort($company_array);

            $sorted_json_list[$folder_name] = $company_array;
        }

        return $sorted_json_list;
    }

    private function process($path, $storageService)
    {
                sleep(3);
                //Get json
                $content = file_get_contents($path);
                $json = json_decode($content, true);

                 //Detect company and project
                if($company = Company::whereCompanyId($json['id_company'])->first() and $project = Project::whereProjectId($json['id_project'])->first()){

                    //New path for files
                    $new_asset_directory = dirname($path);
                    $company_path = $company->company_id ;

                    //File path from json
                    $thumbnail = $new_asset_directory . '/'. $json['thumbnail']['file_path'];
                    $cover = $new_asset_directory . '/'. $json['cover']['file_path'];

                    if(isset($json['video']['file_path'] )) {
                        $video_path = $new_asset_directory . '/'. $json['video']['file_path'];
                    } else {
                        $path_video = pathinfo($path);
                        $video_path = $new_asset_directory . '/'. $path_video['filename'] .'.mp4'; //we need to transfer old json files
                    }


                    //If any files not exists - just return
                    if(!file_exists($video_path) or !file_exists($thumbnail) or !file_exists($cover)) return;


                    //Create new asset
                    $asset = new Asset();
                    $new_asset_id = unique_random($asset, 'asset_id');
                    $asset->asset_id = $new_asset_id;
                    //$asset->vdms_id = $new_asset_id;
                    $asset->project()->associate($project);
                    $asset->company()->associate($company);
                    $asset->title = $json["short_title"];
                    $asset->description = $json["long_title"];
                    $asset->long_description = $json["description"];
                    $asset->status = $company->auto_published ? StatusAsset::Uploading : StatusAsset::Draft;

                    $add_top_news =  (($json["order_asset"]=== 0) && ((count ($json['list']) >= self::add_top_news_limit))) ? true : false;
                    $new_video_path =  $company_path .'/'. $new_asset_id . '.mp4';

                    //Move video from company directory to Mezaninne dir
                    if (isset($video_path)) {
                        if (!file_exists(config('console.mezaninneDirectory'). $company_path)) {
                            mkdir(config('console.mezaninneDirectory'). $company_path, 0777, true);
                        }

                        try {
                            $storageService->moveAssetVideoToMezaninne($video_path, config('console.mezaninneDirectory'). $new_video_path);
                        } catch(\Exception $e){

                            \Log::warning('Video file cant be moved to the storage! ' . $path);
                            \Log::debug($e->getMessage());

                            return;
                        }

                        $asset->path_mezaninne = $new_video_path;
                    }

                    //Upload thumbnail
                    if (file_exists($thumbnail)) {
                        if($upload = $storageService->saveTmpImageAssetFile((new File($thumbnail)), $asset->asset_id, 'poster')){

                           $asset->poster = $upload->id;

                           unlink($thumbnail);
                        }
                    }

                    //Upload cover
                    if (file_exists($cover)) {
                        if($upload = $storageService->saveTmpImageAssetFile((new File($cover)), $asset->asset_id, 'cover')){
                            $asset->cover = $upload->id;

                            unlink($cover);
                        }
                    }


                    //Need to correct work with sync metatags
                    if($asset->save()){

                        $top_news_tag = null;

                        /**
                        *   Detect company tags
                        */
                        if ($company->meta_tags) $company_tag_ids = $company->meta_tags->pluck('id');


                        /**
                        *   Detect "Top news" tag
                        */
                        if($add_top_news and $company->is_auto_assign_top_news_tag) $top_news_tag = Tag::whereIsTopNewsTag(true)->selectRaw('id')->first();


                        /**
                        *   Sync tags
                        */
                        if(($company_tag_ids) or ($add_top_news and $top_news_tag)){

                            $asset->tags()->sync(

                                ($add_top_news and $top_news_tag) ? array_merge((array) $top_news_tag->id, $company_tag_ids->toArray()) : $company_tag_ids->toArray()
                            );
                        }


                        //Save to vdms if company auto publish
                        if ($company->auto_published)  dispatch((new StoreToVDMSJob($asset)));

                        unlink($path);
                    }
                }
    }
}
