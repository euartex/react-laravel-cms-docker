<?php

namespace App\Http\Controllers\API\v1;

use App\Asset;
use App\Http\Requests\AssetRequest;
use App\Enums\AssetType;
use App\Services\StorageService;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ArticleController extends AssetController
{

    /**
     * @OA\Get(
     *     path="/api/v1/articles",
     *       tags={"Articles"},
     *       summary="Show list of all articles",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="The articles has been got successfully"),
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
     *)
     **/
    public function index(AssetRequest $request)
    {
        $request->instance()->merge(['type_arr' => [AssetType::Article]]);

        return parent::index($request);
    }


     /**
     * @OA\Delete(
     *     path="/api/v1/articles",
     *       tags={"Articles"},
     *       summary="Delete specific article",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Specific article has been deleted"),
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
        $articles = Asset::selectOnlyId()
            ->whereType(AssetType::Article)
            ->whereIn('id', request('ids'))
            ->get();

        $request->instance()->merge(['ids' => $articles->toArray()]);

        return parent::destroy($request);
    }


    /**
     * @OA\Get(
     *     path="/api/v1/articles/{id}",
     *       tags={"Articles"},
     *       summary="Show  specific article",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Article has been got"),
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
        if($article = Asset::selectOnlyId()
            ->whereType(AssetType::Article)
            ->whereId($id)->first()) {
            return parent::show($request, $article->id);
        }

        throw new ModelNotFoundException('Article not found');
    }

    /**
     * @OA\Put(
     *     path="/api/v1/articles/{id}",
     *     tags={"Articles"},
     *     summary="Update  specific asset",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Article has been updated successfully"),
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
        if($article = Asset::selectOnlyId()
            ->whereType(AssetType::Article)
            ->whereId($id)->first()) {

            $request->instance()->merge(['type' => AssetType::Article]);

            return parent::update($storageService, $request, $article->id);
        }

        throw new ModelNotFoundException('Article not found');
    }



    /**
     * @OA\Post(
     *     path="/api/v1/articles",
     *     tags={"Articles"},
     *     summary="Create  new  article",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Article has been created successfully"),
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
        $request->instance()->merge(['type' => AssetType::Article]);

        return parent::store($storageService,  $request);
    }
}
