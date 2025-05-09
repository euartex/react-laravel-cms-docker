<?php

namespace App\Http\Controllers\API\V1;

use App\Enums\StatusCode;
use App\Helpers\HelperController;
use App\Http\Requests\TagRequest;
use App\Tag;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;


class TagController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/v1/tags/accessible-list",
     *       tags={"Tags"},
     *       summary="Get list of all Tags (Accessible)",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of Tags has been got"),
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
     *     @OA\Parameter(
     *         description="Get all without any relationships",
     *         in="query",
     *         name="without_relations",
     *         required=false,
     *         @OA\Schema(
     *             type="boolean",
     *         ),
     *      ),
     *     @OA\Parameter(
     *         description="Show top news tag only",
     *         in="query",
     *         name="is_top_news_tag",
     *         required=false,
     *         @OA\Schema(
     *             type="boolean",
     *         ),
     *      ),
     *)
     */

    public function list(TagRequest $request)
    {
        return $this->getTags($request, true);
    }


    /**
     * @OA\Put(
     *     path="/api/v1/tags/{id}",
     *       tags={"Tags"},
     *       summary="Update Tag",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Parameter(
     *         description="Id of tag",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64",
     *         ),
     *     ),
     *     @OA\Response(response="200", description="The tag has been updated successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  required={"title"},
     *                  @OA\Property(property="title",   type="string"),
     *                  @OA\Property(property="metadata_ids", type="integer"),
     *                  @OA\Property(property="is_top_news_tag", type="boolean"),
     *                  @OA\Property(property="is_asset_pl_add_sort_by_id", type="boolean", description="Use for   assets  sorting inside specific playlist by id"),
     *             )
     *         )
     *      ),
     *)
     */
    public function update(TagRequest $request, $id)
    {
        if ($tag = Tag::findOrFail($id)) {

            $tag->fill($request->all());

            if ($tag->save()) {

                $tag->meta()->sync(request('metadata_ids'));

                $tag->refresh();

                return response()->json(['data' => $tag], StatusCode::SUCCESS);
            }
        }

        return response()->json(['message' => $tag->error ?? 'Bad request'], StatusCode::BAD_REQUEST);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/tags",
     *       tags={"Tags"},
     *       summary="Create new Tag",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="The tag has been created successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  required={"title"},
     *                  @OA\Property(property="title",   type="string"),
     *                  @OA\Property(property="metadata_ids", type="integer"),
     *                  @OA\Property(property="is_top_news_tag", type="boolean"),
     *                  @OA\Property(property="is_asset_pl_add_sort_by_id", type="boolean", description="Use for   assets  sorting inside specific playlist by id"),
     *             )
     *         )
     *      ),
     *)
     */
    public function store(TagRequest $request)
    {
        if ($tag = Tag::create($request->all())) {

            $tag->meta()->attach(request('metadata_ids'));

            return response()->json(['data' => $tag], StatusCode::SUCCESS);
        }

        return response()->json(['message' => $tag->error ?? 'Bad request'], StatusCode::BAD_REQUEST);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/tags",
     *       tags={"Tags"},
     *       summary="Get list of all Tags",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of Tags has been got"),
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
     *     @OA\Parameter(
     *         description="Get all without any relationships",
     *         in="query",
     *         name="without_relations",
     *         required=false,
     *         @OA\Schema(
     *             type="boolean",
     *         ),
     *      ),
     *     @OA\Parameter(
     *         description="Show top news tag only",
     *         in="query",
     *         name="is_top_news_tag",
     *         required=false,
     *         @OA\Schema(
     *             type="boolean",
     *         ),
     *      ),
     *)
     */
    public function index(TagRequest $request)
    {
        return $this->getTags($request);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/tags/{id}",
     *       tags={"Tags"},
     *       summary="Get Tags",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Tags has been got"),
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
        if ($tag = Tag::findOrFail($id)) return response()->json(['data' => $tag], StatusCode::SUCCESS);
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/tags/{id}",
     *       tags={"Tags"},
     *       summary="Tag delete",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="The Tag has been deleted"),
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
        $tag = Tag::findOrfail($id);

        if ($tag->delete()) {

            return response()->json(['message' => 'The Tags has been deleted'], StatusCode::SUCCESS);
        } else {

            return response()->json(['message' => $tag->error ?? 'Bad request'], StatusCode::BAD_REQUEST);
        }
    }


    public function getTags(TagRequest $request, $limited = false)
    {

        if (!$request->filled('limit')) $limit = 20; else $limit = request('limit');

        $tags = HelperController::getEloquentBuilderWithoutRelationshipsByRequest(
            $request,
            Tag::search(
                request('q'),
                null,
                true,
                true
            )
        )
            ->orderBy('id', 'DESC')->ListSelect($limited);

        /**
         *   Show top news tag only
         */
        if ($request->filled('is_top_news_tag')) $tags->whereIsTopNewsTag(true);


        if ($tags = $tags->paginate($limit)) {

            $tags = $tags->toArray();

            return response()->json([
                'data' => $tags['data'],
                'pagination' => HelperController::getPagination($tags)
            ], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }
}
