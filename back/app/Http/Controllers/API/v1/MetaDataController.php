<?php

namespace App\Http\Controllers\API\V1;

use App\Enums\StatusCode;
use App\Helpers\HelperController;
use App\Http\Requests\MetadataRequest;
use App\Metadata;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;


class MetaDataController extends Controller
{

    /**
     * @OA\Put(
     *     path="/api/v1/metadata/{id}",
     *       tags={"MetaData"},
     *       summary="Update Metadata",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Parameter(
     *         description="Id of metadata",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64",
     *         ),
     *     ),
     *     @OA\Response(response="200", description="Metadata has been updated successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  required={"name"},
     *                  @OA\Property(property="name",   type="string"),
     *                  @OA\Property(property="tag_ids", type="array",
     *                      @OA\Items(type="integer"),
     *                   ),
     *             )
     *         )
     *      ),
     *)
     */
    public function update(MetadataRequest $request, $id)
    {
        if ($meta = Metadata::findOrFail($id)) {

            $meta->fill($request->all());

            if ($meta->save()) {

                $meta->tags()->sync(request('tag_ids'));

                $meta->refresh();

                return response()->json(['data' => $meta], StatusCode::SUCCESS);
            }
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/metadata",
     *       tags={"MetaData"},
     *       summary="Create new Metadata",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Metadata has been created successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  required={"name"},
     *                  @OA\Property(property="name",   type="string"),
     *                  @OA\Property(property="tag_ids", type="array",
     *                      @OA\Items(type="integer"),
     *                   ),
     *             )
     *         )
     *      ),
     *)
     */
    public function store(MetadataRequest $request)
    {
        if ($meta = metadata::create($request->all())) {

            $meta->tags()->sync(request('tag_ids'));

            return response()->json(['data' => $meta], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/metadata/accessible-list",
     *       tags={"MetaData"},
     *       summary="Get list of all Metadata (accessible)",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of Metadata has been got"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
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
     */
    public function list(MetadataRequest $request)
    {
        return $this->getMetadata($request);
    }



    /**
     * @OA\Get(
     *     path="/api/v1/metadata",
     *       tags={"MetaData"},
     *       summary="Get list of all Metadata",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of Metadata has been got"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
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
     */
    public function index(MetadataRequest $request)
    {
        return $this->getMetadata($request);
    }

    public function getMetadata(MetadataRequest $request)
    {
        if (!$request->filled('limit')) $limit = 20; else $limit = request('limit');

        if ($meta =  Metadata::listSelect()->search(request('q'), null, true, true)->orderBy('id', 'DESC')->paginate($limit)) {

            $meta = $meta->toArray();

            return response()->json([
                'data' => $meta['data'],
                'pagination' => HelperController::getPagination($meta)
            ], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/metadata/{id}",
     *       tags={"MetaData"},
     *       summary="Get Metadata",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Metadata has been got"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="User id",
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
    public function show($id)
    {
        if ($meta = Metadata::findOrFail($id)) return response()->json(['data' => $meta], StatusCode::SUCCESS);
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/metadata/{id}",
     *       tags={"MetaData"},
     *       summary="Metadata delete",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="The Metadata has been deleted"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="User id",
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
    public function destroy($id)
    {
        $meta = Metadata::findOrfail($id);

        if ($meta->delete()) return response()->json(['message' => 'The Metadata has been deleted'], StatusCode::SUCCESS);
    }
}
