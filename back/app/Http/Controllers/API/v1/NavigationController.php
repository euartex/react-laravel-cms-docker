<?php

namespace App\Http\Controllers\API\v1;

use App\Enums\StatusCode;
use App\Helpers\HelperController;
use App\Http\Controllers\Controller;
use App\Http\Requests\AssetRequest;
use App\Http\Requests\NavigationRequest;
use App\Http\Requests\StaticPageRequest;
use App\Navigation;
use App\NavigationType;
use App\StaticPage;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class NavigationController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/v1/navigations/types",
     *       tags={"Navigations"},
     *       summary="Get list of all navigation types",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of navigation types has been got"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *)
     */
    public function types(NavigationRequest $request)
    {

        $types = NavigationType::all();

        if($types) {
            return response()->json([
                'data' => $types,
            ], StatusCode::SUCCESS);
        }
        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/navigations",
     *       tags={"Navigations"},
     *       summary="Get list of all navigations",
     *       description="By default, deleted items are not shown. If you want to get deleted items only, please use only_deleted = true in request",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of navigations has been got"),
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
    public function index(NavigationRequest $request)
    {

        $project_id = request('project_id');
        $slug = HelperController::getDeviceTypeSlugFromRequest();

        if (!$request->filled('limit')) $limit = 20; else $limit = request('limit');


        $navigations = Navigation::listSelect()->whereHas('project', function (Builder $query) use ($project_id, $request) {
            if ($request->filled('project_id')) {
                $query->whereId($project_id);
            }
        })->whereHas('deviceTypes', function (Builder $query) use ($slug) {
            $query->whereSlug($slug);
        })->orderBy('order');

        if ($request->get('only_deleted') == true)
            $navigations->onlyTrashed();

        if ($request->filled('q'))
            $navigations = $navigations->search(request('q'),null, true, true);

        if ($navigations = $navigations->paginate($limit)) {
            $navigations = $navigations->toArray();

            return response()->json([
                'data' => $navigations['data'],
                'pagination' => HelperController::getPagination($navigations)
            ], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Get(
     *     path="/api/v1/navigations/{id}",
     *       tags={"Navigations"},
     *       summary="Get one navigation",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Show info about navigation"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Navigation id",
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
    public function show(NavigationRequest $id)
    {
        if ($navigation = Navigation::with(['playlists' => function ($query) {
            $query->without(['assets','meta_tags','poster','cover']);
        }])->findOrFail($id)) return response()->json(['data' => $navigation], StatusCode::SUCCESS);
    }


    /**
     * @OA\Post(
     *     path="/api/v1/navigations",
     *       tags={"Navigations"},
     *       summary="Create new navigation",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Navigation has been created successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  required={"title","project_id", "type_id"},
     *                  @OA\Property(property="title", type="string"),
     *                  @OA\Property(property="cms_title", type="string"),
     *                  @OA\Property(property="description", type="string"),
     *                  @OA\Property(property="seo_title", type="string"),
     *                  @OA\Property(property="seo_description", type="string"),
     *                  @OA\Property(property="project_id", type="integer"),
     *                  @OA\Property(property="type_id", type="integer"),

     *                  @OA\Property(
     *                      property="playlist_arr",
     *                      type="array",
     *                      @OA\Items(type="integer")
     *                  ),
     *             )
     *         )
     *      ),
     *)
     */
    public function store(NavigationRequest $request)
    {
        $request_data = $request->all();

        $navigation = Navigation::create($request_data);

        //Sync playlists
        if ($request->filled('playlist_arr'))
            $navigation->playlists()->sync($request->get('playlist_arr'));


        if ($navigation->save()) return response()->json(['data' => $navigation], StatusCode::SUCCESS);

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Put(
     *     path="/api/v1/navigations/{id}",
     *       tags={"Navigations"},
     *       summary="Update navigation",
     *       description="Please use method POST and add to form request field '_method' with value 'PUT'.",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Navigation has been updated successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Navigation id",
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
     *                  @OA\Property(property="title", type="string"),
     *                  @OA\Property(property="cms_title", type="string"),
     *                  @OA\Property(property="description", type="string"),
     *                  @OA\Property(property="seo_title", type="string"),
     *                  @OA\Property(property="seo_description", type="string"),
     *                  @OA\Property(property="project_id", type="integer"),
     *                  @OA\Property(property="type_id", type="integer"),

     *                  @OA\Property(
     *                      property="playlist_arr",
     *                      type="array",
     *                      @OA\Items(type="integer")
     *                  ),
     *             )
     *         )
     *      ),
     *)
     */
    public function update(NavigationRequest $request, $id)
    {
        if ($navigation = Navigation::findOrFail($id)) {

            $navigation->fill($request->all());

            //Sync playlists
            if ($request->filled('playlist_arr'))
                $navigation->playlists()->sync($request->get('playlist_arr'));


            if ($navigation->save()) {

                $navigation->refresh();

                return response()->json(['data' => $navigation], StatusCode::SUCCESS);
            }
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Delete(
     *     path="/api/v1/navigations/{id}",
     *       tags={"Navigations"},
     *       summary="Delete navigation",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Navigation has been deleted successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Navigation id",
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
        if ($navigation = Navigation::findOrFail($id)) {
            if ($navigation->delete()) return response()->json(['message' => 'Navigation has been deleted'], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Post(
     *     path="/api/v1/navigations/restore/{id}",
     *       tags={"Navigations"},
     *       summary="Restore deleted navigation",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Navigation has been restored successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Navigation id",
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
        if ($navigation = Navigation::onlyTrashed()->find($id)) {
            if ($navigation->restore()) return response()->json(['message' => 'Navigation has been restored'], StatusCode::SUCCESS);
        }
        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Post(
     *     path="/api/v1/navigations/order",
     *       tags={"Navigations"},
     *       summary="Order navigation",
     *       description="See more <a href='https://github.com/boxfrommars/rutorika-sortable#jquery-ui-sortable-example'>here</a>",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="See response status"),
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
            'entityName' => 'navigations',
            'id' => $request->get('id'),
            'type' => $request->get('type'),
            'positionEntityId' => $request->get('positionEntityId')
        ];

        $request = Request::create(route('sort'), 'POST', $params);

        $response = app()->handle($request);

        return response()->json(['data' => json_decode($response->getContent(),true)], $response->getStatusCode());
    }


    /**
     * @OA\Post(
     *     path="/api/v1/navigations/{id}/order-playlists",
     *       tags={"Navigations"},
     *       summary="Order playlists in navigation",
     *       description="See more <a href='https://github.com/boxfrommars/rutorika-sortable#jquery-ui-sortable-example'>here</a>",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="See response status"),
     *     @OA\Parameter(
     *         description="Navigation id",
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
     *                  required={"id_playlist","type","positionEntityId"},
     *                  @OA\Property(property="id_playlist", type="integer"),
     *                  @OA\Property(property="type", type="string", description="moveBefore,moveAfter"),
     *                  @OA\Property(property="positionEntityId", type="ineger"),
     *             )
     *         )
     *      ),
     *)
     */
    public function orderPlaylists(NavigationRequest $request, $id)
    {
        $params = [
            'entityName' => 'navigation_playlists',
            'parentId' => $id,
            'id' => $request->get('id_playlist'),
            'type' => $request->get('type'),
            'positionEntityId' => $request->get('positionEntityId')
        ];

        $request = Request::create(route('sort'), 'POST', $params);

        if($response = app()->handle($request)){

            if($nav = Navigation::findOrFail($id)) $nav->touch(); //Need for cache clearing

            return response()->json(['data' => json_decode($response->getContent(), true)], $response->getStatusCode());
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }
}
