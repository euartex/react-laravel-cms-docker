<?php

namespace App\Http\Controllers\API\v1;

use App\Enums\StatusCode;
use App\Helpers\HelperController;
use App\Http\Controllers\Controller;
use App\Http\Requests\BannerRequest;
use App\Banner;
use App\Services\StorageService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;


class BannerController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/banners",
     *       tags={"Banners"},
     *       summary="Get list of all banners ",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of banners has been got"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Id of project",
     *         in="query",
     *         name="project_id",
     *         required=false,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64",
     *         ),
     *     ),
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
     *         description="Get only deleted items",
     *         in="query",
     *         name="only_deleted",
     *         required=false,
     *         @OA\Schema(
     *             type="boolean",
     *             format="int64",
     *         ),
     *     ),
     *)
     */
    public function index(BannerRequest $request)
    {

        if (!$request->filled('limit')) $limit = 20; else $limit = request('limit');

        $banners = Banner::query();

        if ($request->filled('project_id')) {

            $project_id = request('project_id');

            $banners->whereHas('project', function (Builder $query) use ($project_id, $request) {
                $query->whereId($project_id);
            });
        }

        if (filter_var(request('only_deleted'), FILTER_VALIDATE_BOOLEAN)) $banners->onlyTrashed();

        if ($request->filled('q')) $banners = $banners->search(request('q'),null, true, true);

        if ($banners = $banners->orderBy('order')->paginate($limit)) {
            $banners = $banners->toArray();

            return response()->json([
                'data' => $banners['data'],
                'pagination' => HelperController::getPagination($banners)
            ], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Get(
     *     path="/api/v1/banners/{id}",
     *       tags={"Banners"},
     *       summary="Get specific banner",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Show info about specific banner"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Banner id",
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
    public function show(BannerRequest $id)
    {
        if ($banner = Banner::findOrFail($id)) return response()->json(['data' => $banner], StatusCode::SUCCESS);
    }


    /**
     * @OA\Post(
     *     path="/api/v1/banners",
     *       tags={"Banners"},
     *       summary="Create new banner",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="The banner has been created successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  required={"name","project_id","image", "timeout"},
     *                  @OA\Property(property="name", type="string"),
     *                  @OA\Property(property="image", type="file"),
     *                  @OA\Property(property="project_id", type="integer"),
     *                  @OA\Property(property="timeout",   description="Minutes" ,type="integer"),
     *             )
     *         )
     *      ),
     *)
     */
    public function store(StorageService $storageService, BannerRequest $request)
    {
        if($banner = Banner::create($request->all())){

            /**
            *   Image file upload like tmp
            */
            if($request->hasFile('image')){

                if($upload = $storageService->saveTmpImageAssetUploadedFile($request->file('image'), $banner->id, 'image')) $banner->img()->associate($upload);

                $banner->save();
            }

            return response()->json(['data' => $banner->fresh()], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Put(
     *     path="/api/v1/banners/{id}",
     *       tags={"Banners"},
     *       summary="Update banner",
     *       description="Please use method POST and add to form request field '_method' with value 'PUT'.",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="The banner has been updated successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Banner id",
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
     *                  @OA\Property(property="name", type="string"),
     *                  @OA\Property(property="image", type="file"),
     *                  @OA\Property(property="project_id", type="integer"),
     *                  @OA\Property(property="timeout",   description="Minutes. If empty = 0 minutes" ,type="integer"),
     *             )
     *         )
     *      ),
     *)
     */
    public function update(StorageService $storageService, BannerRequest $request, $id)
    {
        if ($banner = Banner::findOrFail($id)) {

            $banner->fill($request->all());


            /**
            *   Image file upload like tmp
            */
            if($request->hasFile('image')){

                if($upload = $storageService->saveTmpImageAssetUploadedFile($request->file('image'), $id, 'image',  $banner->image)) $banner->img()->associate($upload);
            }


            if ($banner->save())  return response()->json(['data' => $banner->fresh()], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/banners",
     *       tags={"Banners"},
     *       summary="Delete specific banners",
     *       description="Please use method POST and add to form request field '_method' with value 'DELETE'.",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Specific banners has been deleted"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Response(response="404", description="Not found"),
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
    public function destroy(BannerRequest $request)
    {
        if(Banner::destroy(request('ids'))) return response()->json(['message' => 'Specific banners has been deleted'], StatusCode::SUCCESS);

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


   /**
     * @OA\Post(
     *     path="/api/v1/banners/restore",
     *       tags={"Banners"},
     *       summary="Restore deleted banners",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Specific banners has been restored successfully"),
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
    public function restore(BannerRequest $request)
    {
        if ($banners = Banner::onlyTrashed()->find(request('ids'))) {

            $banners->map(function ($banner) {
                return $banner->restore();
            });

            return response()->json(['message' => 'Specific banners has been restored successfully'], StatusCode::SUCCESS);
        }
        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Post(
     *     path="/api/v1/banners/order",
     *       tags={"Banners"},
     *       summary="Order for banners",
     *       description="See more <a href='https://github.com/boxfrommars/rutorika-sortable#jquery-ui-sortable-example'>here</a>",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="The banners has been sorted"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  required={"id","type","positionEntityId"},
     *                  @OA\Property(property="id", type="integer"),
     *                  @OA\Property(property="type", type="string", description="moveBefore,moveAfter"),
     *                  @OA\Property(property="positionEntityId", type="ineger"),
     *             )
     *         )
     *      ),
     *)
     */
    public function order(Request $request)
    {
        $params = [
            'entityName' => 'banners',
            'id' => $request->get('id'),
            'type' => $request->get('type'),
            'positionEntityId' => $request->get('positionEntityId')
        ];

        $request = Request::create(route('sort'), 'POST', $params);

        $response = app()->handle($request);

        return response()->json(['data' => json_decode($response->getContent(),true)], $response->getStatusCode());
    }
}
