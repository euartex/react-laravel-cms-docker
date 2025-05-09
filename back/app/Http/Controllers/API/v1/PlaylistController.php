<?php

namespace App\Http\Controllers\API\v1;

use App\Enums\StatusCode;
use App\Helpers\HelperController;
use App\Http\Controllers\Controller;
use App\Http\Requests\PlaylistRequest;
use App\Playlist;
use Illuminate\Http\Request;
use App\Upload;
use App\Services\StorageService;

class PlaylistController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/v1/playlists/accessible-list",
     *       tags={"Playlists"},
     *       summary="Get list of all playlists (accessible)",
     *       description="By default, deleted items are not shown. If you want to get deleted items only, please use only_deleted = true in request",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of playlists has been got"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Show top playlist",
     *         in="query",
     *         name="is_top",
     *         @OA\Schema(
     *             type="boolean",
     *         ),
     *     ),
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
     *     @OA\Parameter(
     *         description="Filter by navigation id",
     *         in="query",
     *         name="navigation_id",
     *         @OA\Schema(
     *             type="integer",
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
     *)
     */

    public function list(PlaylistRequest $request)
    {
        return $this->getPlaylists($request, true);
    }



    /**
     * @OA\Get(
     *     path="/api/v1/playlists",
     *       tags={"Playlists"},
     *       summary="Get list of all playlists",
     *       description="By default, deleted items are not shown. If you want to get deleted items only, please use only_deleted = true in request",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of playlists has been got"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Show top playlist",
     *         in="query",
     *         name="is_top",
     *         @OA\Schema(
     *             type="boolean",
     *         ),
     *     ),
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
     *     @OA\Parameter(
     *         description="Filter by navigation id",
     *         in="query",
     *         name="navigation_id",
     *         @OA\Schema(
     *             type="integer",
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
     *)
     */
    public function index(PlaylistRequest $request)
    {
        return $this->getPlaylists($request);
    }


    public function getPlaylists(PlaylistRequest $request, $limited = false)
    {
        if (!$request->filled('limit')) $limit = 20; else $limit = request('limit');

        $playlists = Playlist::query()->listSelect($limited);


        if ($request->filled('navigation_id')) {

            $playlists = $playlists->join('navigation_playlist', 'playlists.id', '=', 'navigation_playlist.playlist_id')
                ->where('navigation_playlist.navigation_id', '=', $request->get('navigation_id'))
                ->select(['playlists.id', 'playlists.name', 'playlists.description',   'playlists.is_top', 'playlists.created_at', 'navigation_playlist.order'])
                ->orderBy('navigation_playlist.order', 'asc');
        }


        if ($request->filled('is_top')) $playlists = $playlists->whereIsTop($request->get('is_top'));

        if ($request->get('only_deleted') == true)
            $playlists->onlyTrashed();

        if ($request->filled('q'))
            $playlists = $playlists->search(request('q'),null, true, true);

        if ($playlists = $playlists->paginate($limit)) {
            $playlists = $playlists->toArray();

            return response()->json([
                'data' => $playlists['data'],
                'pagination' => HelperController::getPagination($playlists)
            ], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/playlists/{id}",
     *       tags={"Playlists"},
     *       summary="Get one playlist",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Show info about playlist"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Playlist id",
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
    public function show(PlaylistRequest $id)
    {
        if ($playlist = Playlist::with(['meta_tags','cover','poster','assets','project'])->findOrFail($id)) return response()->json(['data' => $playlist], StatusCode::SUCCESS);
    }


    /**
     * @OA\Post(
     *     path="/api/v1/playlists",
     *       tags={"Playlists"},
     *       summary="Create new playlist",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Playlist has been created successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  required={"name","project_id"},
     *                  @OA\Property(property="name",   type="string"),
     *                  @OA\Property(property="description", type="string"),
     *                  @OA\Property(property="project_id", type="integer"),
     *                  @OA\Property(property="poster", type="string", format="binary"),
     *                  @OA\Property(property="cover", type="string", format="binary"),
     *                  @OA\Property(property="is_top", type="boolean"),
     *                  @OA\Property(
     *                      property="asset_ids",
     *                      type="array",
     *                      @OA\Items(type="integer")
     *                  ),
     *                  @OA\Property(
     *                      property="tag_ids",
     *                      type="array",
     *                      @OA\Items(type="integer")
     *                  ),
     *             )
     *         )
     *      ),
     *)
     */
    public function store(StorageService $storageService, PlaylistRequest $request)
    {
        $request_data = $request->except(['poster', 'cover']);

        $playlist = Playlist::create($request_data);

        /**
        *   Poster file upload like tmp
        */
        if($request->hasFile('poster')){

            if($upload = $storageService->saveTmpImageAssetUploadedFile($request->file('poster'), $playlist->playlist_id, 'poster',  $playlist->poster_id)) $playlist->poster_id = $upload->id;
        }

        /**
        *   Cover file upload like tmp
        */
        if($request->hasFile('cover')){

            if($upload = $storageService->saveTmpImageAssetUploadedFile($request->file('cover'), $playlist->playlist_id, 'cover',  $playlist->cover_id)) $playlist->cover_id = $upload->id;
        }

        //Sync asset
        if ($request->filled('asset_ids')) $playlist->assets()->sync($request->get('asset_ids'));

        //Sync tags
        if ($request->filled('tag_ids'))
            $playlist->meta_tags()->sync($request->get('tag_ids'));

        if ($playlist->save()){


            return response()->json(['data' => $playlist], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Put(
     *     path="/api/v1/playlists/{id}",
     *       tags={"Playlists"},
     *       summary="Update playlist",
     *       description="Please use method POST and add to form request field '_method' with value 'PUT'.",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Playlist has been updated successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Playlist id",
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
     *                  @OA\Property(property="name",   type="string"),
     *                  @OA\Property(property="description", type="string"),
     *                  @OA\Property(property="project_id", type="integer"),
     *                  @OA\Property(property="poster", type="string", format="binary"),
     *                  @OA\Property(property="cover", type="string", format="binary"),
     *                  @OA\Property(property="is_top", type="boolean"),
     *                  @OA\Property(
     *                      property="asset_ids",
     *                      type="array",
     *                      @OA\Items(type="integer")
     *                  ),
     *                  @OA\Property(
     *                      property="tag_ids",
     *                      type="array",
     *                      @OA\Items(type="integer")
     *                  ),
     *             )
     *         )
     *      ),
     *)
     */
    public function update(StorageService $storageService, PlaylistRequest $request, $id)
    {



        /**
        *   Playlist detect
        */
        if ($playlist = Playlist::findOrFail($id)) {


            /**
            *   If is_top == false, i'll check current playlist is top or not. If top, return validation error.
            */
            if($request->filled('is_top') and !filter_var(request('is_top'), FILTER_VALIDATE_BOOLEAN)){

                if($playlist->is_top) return response()->json(['message' => 'You must have a Top Playlist. If you want to change it - please edit the playlist you want to be the new Top Playlist.'], StatusCode::BAD_REQUEST);
            }

            /**
            *   Fill all fields from request
            */
            $playlist->fill($request->all());



            /**
            *   Poster file upload like tmp
            */
            if($request->hasFile('poster')){

                if($upload = $storageService->saveTmpImageAssetUploadedFile($request->file('poster'), $playlist->playlist_id, 'poster',  $playlist->poster_id)) $playlist->poster()->associate($upload);
            }

            /**
            *   Cover file upload like tmp
            */
            if($request->hasFile('cover')){

                if($upload = $storageService->saveTmpImageAssetUploadedFile($request->file('cover'), $playlist->playlist_id, 'cover',  $playlist->cover_id)) $playlist->cover()->associate($upload);
            }

            //Sync asset
            $playlist->assets()->sync($request->get('asset_ids'));

            //Sync tags
            $playlist->meta_tags()->sync($request->get('tag_ids'));


            if($playlist->save()){

                return response()->json(['data' => $playlist->fresh()], StatusCode::SUCCESS);
            }
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Delete(
     *     path="/api/v1/playlists/{id}",
     *       tags={"Playlists"},
     *       summary="Delete playlist",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Playlist has been deleted successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Playlist id",
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
        if ($playlist = Playlist::findOrFail($id)) {

            if($playlist->is_top) return response()->json(['message' => 'You must have a Top Playlist. If you want to change it - please edit the playlist you want to be the new Top Playlist.'], StatusCode::VALIDATION_ERROR);

            if ($playlist->delete()) return response()->json(['message' => 'Playlist has been deleted'], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Post(
     *     path="/api/v1/playlists/restore/{id}",
     *       tags={"Playlists"},
     *       summary="Restore deleted playlist",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Playlist has been restored successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Playlist id",
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
    public function restore($id)
    {
        if ($playlist = Playlist::onlyTrashed()->find($id)) {
            if ($playlist->restore()) return response()->json(['message' => 'Playlist has been restored'], StatusCode::SUCCESS);
        }
        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Post(
     *     path="/api/v1/playlists/{id}/order-assets",
     *       tags={"Playlists"},
     *       summary="Order assets in playlist",
     *       description="See more <a href='https://github.com/boxfrommars/rutorika-sortable#jquery-ui-sortable-example'>here</a>",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="See response status"),
     *     @OA\Parameter(
     *         description="Playlist id",
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
     *                  required={"id_asset", "type","positionEntityId"},
     *                  @OA\Property(property="id_asset", type="integer"),
     *                  @OA\Property(property="type", type="string", description="moveBefore,moveAfter"),
     *                  @OA\Property(property="positionEntityId", type="ineger"),
     *             )
     *         )
     *      ),
     *)
     */
    public function orderAssets(PlaylistRequest $request, $id)
    {
        $params = [
            'entityName' => 'playlist_assets',
            'parentId' => $id,
            'id' => request('id_asset'),
            'type' => request('type'),
            'positionEntityId' => request('positionEntityId')
        ];

        $request = Request::create(route('sort'), 'POST', $params);

        if($response = app()->handle($request)){

            if($pl = Playlist::findOrFail($id)) $pl->touch(); //Need for cache clearing

            return response()->json(['data' => json_decode($response->getContent(), true)], $response->getStatusCode());
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }
}
