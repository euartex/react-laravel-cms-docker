<?php

namespace App\Http\Controllers\API\v1;

use App\Enums\StatusCode;
use App\Helpers\HelperController;
use App\Http\Controllers\Controller;
use App\Http\Requests\ShowRequest;
use App\Services\StorageService;
use App\Show;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class ShowController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/v1/shows/accessible-list",
     *       tags={"Shows"},
     *       summary="Get list of all shows",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of shows has been got"),
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
     *         description="Sort  fields (comma separated like: title,id) by DESC",
     *         in="query",
     *         name="sortDesc",
     *         @OA\Schema(
     *             type="string",
     *         ),
     *      ),
     *     @OA\Parameter(
     *         description="Sort fields (comma separated like: title,id) by ASC",
     *         in="query",
     *         name="sort",
     *         @OA\Schema(
     *             type="string",
     *         ),
     *      ),
     *)
     */

    public function list(ShowRequest $request)
    {
        return $this->getShows($request, true);
    }


    /**
     * @OA\Get(
     *     path="/api/v1/shows",
     *       tags={"Shows"},
     *       summary="Get list of all shows",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of shows has been got"),
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
     *         description="Sort  fields (comma separated like: title,id) by DESC",
     *         in="query",
     *         name="sortDesc",
     *         @OA\Schema(
     *             type="string",
     *         ),
     *      ),
     *     @OA\Parameter(
     *         description="Sort fields (comma separated like: title,id) by ASC",
     *         in="query",
     *         name="sort",
     *         @OA\Schema(
     *             type="string",
     *         ),
     *      ),
     *)
     */
    public function index(ShowRequest $request)
    {
        return $this->getShows($request);
    }


    public function getShows(ShowRequest $request)
    {
        if (!$request->filled('limit')) $limit = 20; else $limit = request('limit');

        $shows = Show::listSelect();

        if ($request->filled('sortDesc')) $shows = $shows->multisort(request('sortDesc'), 'DESC');
        if ($request->filled('sort')) $shows = $shows->multisort(request('sort'), 'ASC');

        if ($request->filled('q'))
            $shows = $shows->search(request('q'),null, true, true);

        if ($shows = $shows->paginate($limit)) {
            $shows = $shows->toArray();

            return response()->json([
                'data' => $shows['data'],
                'pagination' => HelperController::getPagination($shows)
            ], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/shows/{id}",
     *       tags={"Shows"},
     *       summary="Get show",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Show info about show"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Show id",
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
    public function show(ShowRequest $id)
    {
        if ($show = Show::findOrFail($id)) return response()->json(['data' => $show], StatusCode::SUCCESS);
    }


    /**
     * @OA\Post(
     *     path="/api/v1/shows",
     *       tags={"Shows"},
     *       summary="Create new show",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Show has been created successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  required={"title","description"},
     *                  @OA\Property(property="title", type="string"),
     *                  @OA\Property(property="description", type="string"),
     *                  @OA\Property(property="cover",   type="file"),
     *                  @OA\Property(property="poster",   type="file"),
     *                  @OA\Property(property="playlist_id", description="Will be used as a donor for poster and cover fields for current show",  type="integer"),
     *             )
     *         )
     *      ),
     *)
     */
    public function store(StorageService $storageService, ShowRequest $request)
    {
        if ($show = Show::create($request->all())) {
            // Assign playlist to current show
            if ($request->filled('playlist_id')) {
                $show->playlist()
                    ->associate($request->post('playlist_id'))
                    ->save();
            }

            // Poster file upload as tmp
            if ($request->hasFile('poster')) {
                if ($upload = $storageService->saveTmpImageAssetUploadedFile($request->file('poster'), $show->id, 'poster')) {
                    $show->poster()->associate($upload)->save();
                }
            }

            // Cover file upload like tmp
            if ($request->hasFile('cover')) {
                if ($upload = $storageService->saveTmpImageAssetUploadedFile($request->file('cover'), $show->id, 'cover')) {
                    $show->cover()->associate($upload)->save();
                }
            }

            return response()->json(['data' => $show], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }

    /**
     * @OA\Put(
     *     path="/api/v1/shows/{id}",
     *       tags={"Shows"},
     *       summary="Update show",
     *       description="Please use method POST and add to form request field '_method' with value 'PUT'.",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Show has been updated successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Show id",
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
     *                  @OA\Property(property="title",   type="string"),
     *                  @OA\Property(property="description", type="string"),
     *                  @OA\Property(property="cover",   type="file"),
     *                  @OA\Property(property="poster",   type="file"),
     *                  @OA\Property(property="playlist_id", description="Will be used as a donor for poster and cover fields for current show",  type="integer"),
     *             )
     *         )
     *      ),
     *)
     */
    public function update(StorageService $storageService, ShowRequest $request, $id)
    {
        if ($show = Show::findOrFail($id)) {
            $show->fill($request->all());

            //  Assign playlist to current show
            if ($request->filled('playlist_id')) {
                $show->playlist()->associate($request->post('playlist_id'));
            }

            // Poster file upload as tmp
            if ($request->hasFile('poster')) {
                if ($upload = $storageService->saveTmpImageAssetUploadedFile($request->file('poster'), $show->id, 'poster')) {
                    $show->poster()->associate($upload)->save();
                }
            }

            // Cover file upload like tmp
            if ($request->hasFile('cover')) {
                if ($upload = $storageService->saveTmpImageAssetUploadedFile($request->file('cover'), $show->id, 'cover')) {
                    $show->cover()->associate($upload)->save();
                }
            }

            if ($show->save()) {
                $show->refresh();

                return response()->json(['data' => $show], StatusCode::SUCCESS);
            }
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/shows/{id}",
     *       tags={"Shows"},
     *       summary="Delete show",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Show has been deleted successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Show id",
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
        if ($show = Show::findOrFail($id)) {

            if ($show->delete()) return response()->json(['message' => 'Show has been deleted'], StatusCode::SUCCESS);
        }
    }
}
