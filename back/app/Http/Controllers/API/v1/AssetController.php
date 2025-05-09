<?php

namespace App\Http\Controllers\API\v1;

use App\Asset;
use App\Enums\AssetType;
use App\Helpers\HelperController;
use App\Http\Controllers\Controller;
use App\Http\Requests\AssetRequest;
use App\Enums\StatusCode;
use App\Enums\StatusAsset;
use App\Services\StorageService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use App\Jobs\StoreToVDMSJob;
use App\Jobs\AssetImport;
use App\Jobs\AssetDelete;
use Illuminate\Http\File;
use Illuminate\Http\UploadedFile;


class AssetController extends Controller
{
    public $model;

    public function __construct($model = null)
    {
        $this->model = $model ? $model : Asset::class;
    }

    /**
     * @OA\Get(
     *     path="/api/v1/assets",
     *       tags={"Assets"},
     *       summary="Show list of all assets",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Got asset list successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="401", description="Validation error"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Parameter(
     *         description="Project id",
     *         in="query",
     *         name="project_id",
     *         required=false,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         ),
     *      ),
     *     @OA\Parameter(
     *         description="Limit items per page",
     *         in="query",
     *         name="limit",
     *         required=false,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64",
     *              default="20"
     *         ),
     *      ),
     *     @OA\Parameter(
     *         description="Page number",
     *         in="query",
     *         name="page",
     *         required=false,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64",
     *              default="0"
     *         ),
     *      ),
     *     @OA\Parameter(
     *         description="Search text",
     *         in="query",
     *         name="q",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *         ),
     *      ),
     *     @OA\Parameter(
     *         description="Sort by is_main attribute. Use for assets with livefeed type",
     *         in="query",
     *         name="is_main",
     *         required=false,
     *         @OA\Schema(
     *             type="boolean",
     *         ),
     *      ),
     *     @OA\Parameter(
     *         description="Exclude by id. Example: 1,2,3...",
     *         in="query",
     *         name="excludeIds",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *         ),
     *      ),
     *     @OA\Parameter(
     *         description="Asset type array. (For example: type_arr[0]=video&type_arr[1]=article...)",
     *         in="query",
     *         name="type_arr",
     *         required=false,
     *         @OA\Schema(
     *             type="array",
     *              @OA\Items(type="string", enum={"video","article","livefeed"}),
     *         ),
     *      ),
     *)
     **/
    public function index(AssetRequest $request)
    {
        $assets = Asset::search($request->get('q'), null, true, true)->listSelect()->withoutWpAutoDrafts();

        if (! $request->filled('limit')) $limit = 20; else $limit = $request->get('limit');

        // Exclude assets by ids
        if ($request->filled('excludeIds')) {
            $excludeIds = explode(',', $request->get('excludeIds'));
            $assets->whereNotIn('id', $excludeIds);
        }

        if($request->filled('project_id'))  $assets->whereProjectId($request->get('project_id'));

        if($request->filled('type_arr'))  $assets->whereIn('type', $request->get('type_arr'));

        if($request->filled('is_main'))  $assets->whereIsMain(filter_var($request->get('is_main'), FILTER_VALIDATE_BOOLEAN));

        $assets->orderBy('id', 'DESC');

        if ($assets = $assets->paginate($limit)) {
            $assets = $assets->toArray();

            return response()->json([
                'data' => $assets['data'],
                'pagination' => HelperController::getPagination($assets)
            ], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }

     /**
     * @OA\Delete(
     *     path="/api/v1/assets",
     *       tags={"Assets"},
     *       summary="Delete specific assets",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Specific assets has been deleted"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  @OA\Property(property="ids",   type="array",
     *                        @OA\Items(type="integer"),
     *                   ),
     *             )
     *         )
     *      ),
     *)
     */
    public function destroy(AssetRequest $request)
    {
        $assets = $this->model::without(['poster','cover'])
            ->selectRaw('id')
            ->whereIn('id', $request->get('ids'))
            ->get();

        if ($assets) {
            AssetDelete::dispatch($assets);
        }

        return $this->successResponse(null, 'Assets removed successfully');
    }

    /**
     * @OA\Get(
     *     path="/api/v1/assets/{id}",
     *       tags={"Assets"},
     *       summary="Show  specific asset",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Asset has been got"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Response(response="404", description="Not found"),
     *     @OA\Parameter(
     *         description="Asset id",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64",
     *         ),
     *      ),
     *)
     */
    public function show(AssetRequest $request, $id)
    {
        if($asset = Asset::withoutWpAutoDrafts()->findOrFail($id)) return response()->json(['data' => $asset], StatusCode::SUCCESS);
    }

    /**
     * @OA\Put(
     *     path="/api/v1/assets/{id}",
     *     tags={"Assets"},
     *     summary="Update  specific asset",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Asset has been updated successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="401", description="Validation error"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="404", description="Not found"),
     *     @OA\Parameter(
     *         description="Id of asset",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64",
     *         ),
     *     ),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  @OA\Property(property="title",   type="string"),
     *                  @OA\Property(property="slug",   type="string"),
     *                  @OA\Property(property="status",   type="string",  enum={"published","draft", "uploading"}),
     *                  @OA\Property(property="description",   type="string"),
     *                  @OA\Property(property="long_description",   type="string"),
     *                  @OA\Property(property="seo_title",   type="string"),
     *                  @OA\Property(property="seo_description",   type="string"),
     *                  @OA\Property(property="company_id",   type="integer"),
     *                  @OA\Property(property="project_id",   type="integer"),
     *                  @OA\Property(property="url", description="Livefeed url",  type="string"),
     *                  @OA\Property(property="cover",   type="file"),
     *                  @OA\Property(property="poster",   type="file"),
     *                  @OA\Property(property="type", description="Accept: video, article, livefeed",  type="string", enum={"published","draft", "uploading"}),
     *                  @OA\Property(property="tag_ids", type="array",
     *                      @OA\Items(type="integer"),
     *                   ),
     *                  @OA\Property(property="vdms_id",   type="string"),
     *                  @OA\Property(property="is_main",  description="Use for select specific asset as main", type="boolean"),
     *                  @OA\Property(property="path_mezaninne",   type="string"),
     *                  @OA\Property(property="start_on", description="Y-m-d H:i:s",  type="string", format="date-time"),
     *                  @OA\Property(property="end_on", description="Y-m-d H:i:s", type="string", format="date-time"),
     *             )
     *         )
     *      ),
     *)
     */
    public function update(StorageService $storageService, AssetRequest $request, $id)
    {
        if($asset = $this->model::findOrFail($id)){

            /**
            *   If is_main == false, i'll check current asset (type = livefeed) is main or not. If asset is main, return validation error.
            */
            if($request->filled('is_main') and !filter_var($request->is_main, FILTER_VALIDATE_BOOLEAN)){

                if($asset->is_main and $asset->type === AssetType::Livefeed) return response()->json(['message' => 'You must have a "main" asset with "livefeed" type. If you want to change it - please edit the asset you want to be the new "main" asset with "Livefeed" type.'], StatusCode::BAD_REQUEST);
            }


            $asset->fill($request->all());


            if($asset->type === AssetType::Video) {

                /**
                 *   Publish and setup uploading status
                 */
                if ($request->filled('status')) {

                    /**
                     * If video doesn't upload yet
                     */
                    if($asset->vdms_id === null) {

                        if ($request->status === StatusAsset::Published) {

                            if ($asset->status === StatusAsset::Draft) {

                                $asset->status = StatusAsset::Uploading;

                                if ($asset->save()) StoreToVDMSJob::dispatch($asset);

                            } else {

                                return response()->json(['message' => 'Asset with "video" type  must have "Draft" status for publish'], StatusCode::BAD_REQUEST);
                            }
                        }
                    }

                    else {

                        /**
                         * Set up draft regardless of status (except Uploading)
                         */
                        if ($request->status !== StatusAsset::Uploading) $asset->status = $request->status;
                    }
                }
            }


            /**
            *   Poster file upload like tmp
            */
            if($request->hasFile('poster')){

                if($upload = $storageService->saveTmpImageAssetUploadedFile($request->file('poster'), $asset->asset_id, 'poster',  $asset->poster)) $asset->poster()->associate($upload);

            }


            /**
            *   Cover file upload like tmp
            */
            if($request->hasFile('cover')){

                if($upload = $storageService->saveTmpImageAssetUploadedFile($request->file('cover'), $asset->asset_id, 'cover',  $asset->cover)) $asset->cover()->associate($upload);
            }


            /**
            *   Status detect for articles, livefeeds
            */
            if($asset->type !== AssetType::Video  and  $request->filled('status')) $asset->status = $request->status;


            /**
            *   If tag_ids filed then sync all tags for current asset
            */
            if($request->filled('tag_ids')) $asset->tags()->sync($request->tag_ids);


            if($asset->save()) return response()->json(['data' => $asset->fresh()], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Post(
     *     path="/api/v1/assets/import",
     *     tags={"Assets"},
     *     summary="Assets import",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Assets has been imported successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="401", description="Validation error"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="404", description="Not found"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="application/json",
     *              @OA\Schema(required={"assets", "action", "slug", "title", "company_id", "project_id"},
     *                  @OA\Property(property="assets", type="array",
     *                      @OA\Items(
     *                         @OA\Property(property="action",   type="string",  enum={"destroy","save", "store"}),
     *                          @OA\Property(property="title",   type="string"),
     *                          @OA\Property(property="id",   type="integer", description="This field for identification specific asset for update or delete"),
     *                          @OA\Property(property="status",   type="string",  enum={"published","draft", "uploading"}),
     *                          @OA\Property(property="description",   type="string"),
     *                          @OA\Property(property="long_description",   type="string"),
     *                          @OA\Property(property="seo_title",   type="string"),
     *                          @OA\Property(property="seo_description",   type="string"),
     *                          @OA\Property(property="company_id",   type="integer"),
     *                          @OA\Property(property="project_id",   type="integer"),
     *                          @OA\Property(property="cover",   type="file"),
     *                          @OA\Property(property="poster",   type="file"),
     *                          @OA\Property(property="type", description="Accept:   article, video, livefeed",  type="string", enum={"article","video", "livefeed"}),
     *                          @OA\Property(property="tag_ids", type="array",
     *                              @OA\Items(type="integer"),
     *                           ),
     *                          @OA\Property(property="url", description="Livefeed url",   type="string"),
     *                          @OA\Property(property="vdms_id",   type="string"),
     *                          @OA\Property(property="wp_post_id",   type="integer", description="This field using by Wordpress plugin <P1ML> for identification assets (articles) as Wordpress post"),
     *                          @OA\Property(property="path_mezaninne",   type="string"),
     *                          @OA\Property(property="is_main", description="Use for select specific asset as main",  type="boolean"),
     *                          @OA\Property(property="start_on", description="Y-m-d H:i:s",  type="string", format="date-time"),
     *                          @OA\Property(property="end_on", description="Y-m-d H:i:s", type="string", format="date-time"),
     *                     ),
     *                 ),
     *              ),
     *         )
     *      ),
     *)
     */

    public function import(StorageService $storageService, AssetRequest $request)
    {

        collect($request->get('assets'))->map(function ($assetImport) use ($storageService){

            $assetImport = collect($assetImport);

            $assetImport->each(function ($value, $key) use ($assetImport){

                if ($value instanceof UploadedFile){

                    if($assetTmpImportFile = Storage::disk('local')->putFile(config('upload.assetImportTmpFilePath'), $assetImport[$key]->getRealPath())){

                        $assetImport[$key] = ['clientOriginalName' => $assetImport[$key]->getClientOriginalName(), 'mimeType' => $assetImport[$key]->getMimeType(), 'realPath' => storage_path('app') . '/' . $assetTmpImportFile];
                    }
                }
            });

            AssetImport::dispatch($assetImport->toArray(),  $storageService);
        });

        return response()->json(['Message' => 'Assets has been imported'], StatusCode::SUCCESS);
    }


    /**
     * @OA\Post(
     *     path="/api/v1/assets",
     *     tags={"Assets"},
     *     summary="Create  new  asset",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Asset has been created successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="401", description="Validation error"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="404", description="Not found"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                   required={"title", "project_id", "company_id"},
     *                  @OA\Property(property="title",   type="string"),
     *                  @OA\Property(property="slug",   type="string"),
     *                  @OA\Property(property="status",   type="string",  enum={"published","draft", "uploading"}),
     *                  @OA\Property(property="description",   type="string"),
     *                  @OA\Property(property="long_description",   type="string"),
     *                  @OA\Property(property="seo_title",   type="string"),
     *                  @OA\Property(property="seo_description",   type="string"),
     *                  @OA\Property(property="company_id",   type="integer"),
     *                  @OA\Property(property="project_id",   type="integer"),
     *                  @OA\Property(property="cover",   type="file"),
     *                  @OA\Property(property="poster",   type="file"),
     *                  @OA\Property(property="url", description="Livefeed url",   type="string"),
     *                  @OA\Property(property="type", description="Accept: video, article, livefeed",  type="string", enum={"video","article", "livefeed"}),
     *                  @OA\Property(property="tag_ids", type="array",
     *                      @OA\Items(type="integer"),
     *                   ),
     *                  @OA\Property(property="vdms_id",   type="string"),
     *                  @OA\Property(property="is_main",  description="Use for select specific asset as main", type="boolean"),
     *                  @OA\Property(property="path_mezaninne",   type="string"),
     *                  @OA\Property(property="start_on", description="Y-m-d H:i:s",  type="string", format="date-time"),
     *                  @OA\Property(property="end_on", description="Y-m-d H:i:s", type="string", format="date-time"),
     *             )
     *         )
     *      ),
     *)
     */
    public function store(StorageService $storageService, AssetRequest $request)
    {

        if($asset = $this->model::create($request->all())){


            $asset->refresh();


            /**
            *   Poster file upload like tmp
            */
            if($request->hasFile('poster')){

                if($upload = $storageService->saveTmpImageAssetUploadedFile($request->file('poster'), $asset->asset_id, 'poster')) $asset->poster()->associate($upload)->save();
            }


            /**
            *   Cover file upload like tmp
            */
            if($request->hasFile('cover')){

                if($upload = $storageService->saveTmpImageAssetUploadedFile($request->file('cover'), $asset->asset_id, 'cover')) $asset->cover()->associate($upload)->save();
            }


            /**
            *   Tags assign
            */
            if($request->filled('tag_ids')) $asset->tags()->sync($request->tag_ids);


            /**
            *   Article
            */
           if($request->type === AssetType::Article){


                /**
                *   Detect article status
                */
                if($request->filled('status') and $request->filled('type')) $asset->status = $request->status;
            }

            if($asset->save()){

                $asset->refresh();

                return response()->json(['data' => $asset], StatusCode::SUCCESS);
            }
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Post(
     *     path="/api/v1/assets/{id}/mezanine/upload/video",
     *       tags={"Assets"},
     *       summary="Upload video file to Mezanine",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Asset has been uploaded to Mezaninne"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Response(response="404", description="Not found"),
     *     @OA\Parameter(
     *         description="Asset id",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64",
     *         ),
     *      ),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  required={"video"},
     *                  @OA\Property(property="video",  description="Video file (mp4, avi, mov)", type="file"),
     *             )
     *         )
     *      ),
     *)
     */

    public function uploadVideoToMezanine(StorageService $storageService, AssetRequest $request, $id)
    {
        if($asset = $this->model::find($id)){


            $storageService->deleteFromMezanine($asset);
            $asset->path_mezaninne = $storageService->saveAssetVideoToMezaninne(new File($request->file('video')), $asset->company->company_id);

            if($asset->status == StatusAsset::Published)
            {
                $asset->status = StatusAsset::Uploading;
                //Save to vdms
                dispatch((new StoreToVDMSJob($asset)));
            }


            if($asset->save()) return response()->json(['message' => 'Uploaded replaced video asset' ], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Post(
     *     path="/api/v1/assets/publish-by-hook",
     *       tags={"Assets"},
     *       summary="Asset publish by hook", deprecated=true,
     *     @OA\Response(response="200", description="Asset  has been published"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Response(response="404", description="Not found"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  required={"status","access_hash"},
     *                  @OA\Property(property="access_hash", default="63d02522ccff9f46ebc007013b1fb004",  type="string"),
     *                  @OA\Property(property="external_id",   type="integer"),
     *                  @OA\Property(property="asset_id",    type="integer"),
     *                  @OA\Property(property="status", default="ok",  type="string"),
     *             )
     *         )
     *      ),
     *)
     */
    public function publishByHook(AssetRequest $request)
    {

        if($request->get('status') === 'ok'){

            if($asset = $this->model::whereAssetId($request->get('external_id'))->first()){

                $asset->vdms_id = $request->get('asset_id');
                $asset->status = StatusAsset::Published;


                if($asset->save()){

                    $asset->sendAssetPublishedEmail(); //Send published asset by email

                    return response()->json(['message' => 'Asset updated successfully' ], StatusCode::SUCCESS);
                }
            }

            return response()->json(['message' => 'Asset not found'], StatusCode::NOT_FOUND);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }
}
