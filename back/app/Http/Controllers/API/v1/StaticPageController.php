<?php

namespace App\Http\Controllers\API\v1;

use App\Enums\StatusCode;
use App\Helpers\HelperController;
use App\Http\Controllers\Controller;
use App\Http\Requests\StaticPageRequest;
use App\StaticPage;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class StaticPageController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/static-pages",
     *       tags={"Static pages"},
     *       summary="Get list of all static pages",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of static pages has been got"),
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
     *)
     */
    public function index(StaticPageRequest $request)
    {

        $project_id = request('project_id');

        if (!$request->filled('limit')) $limit = 20; else $limit = request('limit');

        $pages = StaticPage::listSelect()->whereHas('project', function (Builder $query) use ($project_id, $request) {
            if ($request->filled('project_id')) {
                $query->whereId($project_id);
            }
        })->orderBy('order');


        if ($request->filled('q'))
            $pages = $pages->search(request('q'),null, true, true);

        if ($pages = $pages->paginate($limit)) {
            $pages = $pages->toArray();

            return response()->json([
                'data' => $pages['data'],
                'pagination' => HelperController::getPagination($pages)
            ], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Get(
     *     path="/api/v1/static-pages/{id}",
     *       tags={"Static pages"},
     *       summary="Get static page",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Show info about static paget"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Static page id",
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
    public function show(StaticPageRequest $request, $id)
    {
        if ($static_page = StaticPage::findOrFail($id)) return response()->json(['data' => $static_page], StatusCode::SUCCESS);
    }


    /**
     * @OA\Post(
     *     path="/api/v1/static-pages",
     *       tags={"Static pages"},
     *       summary="Create new static page",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Static page has been created successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  required={"title","project_id", "type"},
     *                  @OA\Property(property="title", type="string"),
     *                  @OA\Property(property="sub_title", type="string"),
     *                  @OA\Property(property="html_content", type="string"),
     *                  @OA\Property(property="project_id", type="integer"),
     *                  @OA\Property(property="type", type="string"),
     *             )
     *         )
     *      ),
     *)
     */
    public function store(StaticPageRequest $request)
    {
        if($static_page = StaticPage::create($request->all())) return response()->json(['data' => $static_page], StatusCode::SUCCESS);

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Put(
     *     path="/api/v1/static-pages/{id}",
     *       tags={"Static pages"},
     *       summary="Update static page",
     *       description="Please use method POST and add to form request field '_method' with value 'PUT'.",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Static page has been updated successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Static page id",
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
     *                  @OA\Property(property="sub_title", type="string"),
     *                  @OA\Property(property="html_content", type="string"),
     *                  @OA\Property(property="project_id", type="integer"),
     *                  @OA\Property(property="type", type="string"),
     *             )
     *         )
     *      ),
     *)
     */
    public function update(StaticPageRequest $request, $id)
    {
        if ($static_page = StaticPage::findOrFail($id)) {

            $static_page->fill($request->all());

            if ($static_page->save()) {
                $static_page->fresh();
                return response()->json(['data' => $static_page], StatusCode::SUCCESS);
            }
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/static-pages/{id}",
     *       tags={"Static pages"},
     *       summary="Delete static page",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Static page has been deleted successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Static page id",
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
        if ($static_page = StaticPage::findOrFail($id)) {

            if ($static_page->delete()) return response()->json(['message' => 'Static page has been deleted'], StatusCode::SUCCESS);
        }
    }


    /**
     * @OA\Post(
     *     path="/api/v1/static-pages/order",
     *       tags={"Static pages"},
     *       summary="Order static page",
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
            'entityName' => 'static_pages',
            'id' => $request->get('id'),
            'type' => $request->get('type'),
            'positionEntityId' => $request->get('positionEntityId')
        ];

        $request = Request::create(route('sort'), 'POST', $params);

        $response = app()->handle($request);

        return response()->json(['data' => json_decode($response->getContent(),true)], $response->getStatusCode());
    }
}
