<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Requests\AssetRequest;
use App\Enums\AssetType;
use App\Livefeed;
use App\Services\StorageService;
use Illuminate\Database\Eloquent\ModelNotFoundException;


class LivefeedController extends AssetController
{

    public function __construct()
    {
        return parent::__construct(Livefeed::class);
    }


    /**
     * @OA\Get(
     *     path="/api/v1/livefeeds",
     *       tags={"Livefeeds"},
     *       summary="Show list of all livefeeds",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="The livefeed has been got successfully"),
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
     *         description="Sort by is_main attribute",
     *         in="query",
     *         name="is_main",
     *         required=false,
     *         @OA\Schema(
     *             type="boolean",
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
     *)
     **/
    public function index(AssetRequest $request)
    {
        $request->instance()->merge(['type_arr' => [AssetType::Livefeed]]);

        return parent::index($request);
    }


    /**
     * @OA\Delete(
     *     path="/api/v1/livefeeds",
     *       tags={"Livefeeds"},
     *       summary="Delete specific livefeed",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Specific livefeed has been deleted"),
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
    public function destroy(AssetRequest $request)
    {
        $livefeeds = $this->model::selectOnlyId()
            ->whereType(AssetType::Livefeed)
            ->whereIn('id', request('ids'))
            ->get();

        $request->instance()->merge(['ids' => $livefeeds->toArray()]);


        return parent::destroy($request);
    }


    /**
     * @OA\Get(
     *     path="/api/v1/livefeeds/{id}",
     *       tags={"Livefeeds"},
     *       summary="Show  specific article",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Livefeed has been got"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Response(response="404", description="Not found"),
     *     @OA\Parameter(
     *         description="Livefeed id",
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
        if($livefeed = $this->model::selectOnlyId()
            ->whereType(AssetType::Livefeed)
            ->whereId($id)->first()) {
                return parent::show($request, $livefeed->id);
            }

        throw new ModelNotFoundException('Livefeed not found');
    }

    /**
     * @OA\Put(
     *     path="/api/v1/livefeeds/{id}",
     *     tags={"Livefeeds"},
     *     summary="Update  specific asset",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="The livefeed has been updated successfully"),
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
        if($livefeed = $this->model::selectOnlyId()
            ->whereType(AssetType::Livefeed)
            ->whereId($id)->first()) {

                $request->instance()->merge(['type' => AssetType::Livefeed]);

                return parent::update($storageService, $request, $livefeed->id);
            }

        throw new ModelNotFoundException('Livefeed not found');
    }


    /**
     * @OA\Post(
     *     path="/api/v1/livefeeds",
     *     tags={"Livefeeds"},
     *     summary="Create  new  livefeed",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="The livefeed has been created successfully"),
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
        $request->instance()->merge(['type' => AssetType::Livefeed]);

        return parent::store($storageService,  $request);
    }
}
