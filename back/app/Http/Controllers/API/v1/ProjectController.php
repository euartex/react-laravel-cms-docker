<?php

namespace App\Http\Controllers\API\v1;

use App\Enums\StatusCode;
use App\Helpers\HelperController;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectRequest;
use App\Project;

class ProjectController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/projects/accessible-list",
     *       tags={"Projects"},
     *       summary="Accessible list of all projects",
     *       description="By default, deleted items are not shown. If you want to get deleted items only, please use only_deleted = true in request",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of projects has been got"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
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
    public function list(ProjectRequest $request)
    {
        return $this->getProjects($request);
    }


    /**
     * @OA\Get(
     *     path="/api/v1/projects",
     *       tags={"Projects"},
     *       summary="Get list of all projects",
     *       description="By default, deleted items are not shown. If you want to get deleted items only, please use only_deleted = true in request",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of projects has been got"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
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
    public function index(ProjectRequest $request)
    {
        return $this->getProjects($request);
    }


    public function getProjects(ProjectRequest $request)
    {

        if (!$request->filled('limit')) $limit = 20; else $limit = request('limit');

        $projects = Project::listSelect();

        if ($request->get('only_deleted') == true)
            $projects->onlyTrashed();

        if ($request->filled('q'))
            $projects = $projects->search(request('q'),null, true, true);

        if ($projects = $projects->paginate($limit)) {
            $projects = $projects->toArray();

            return response()->json([
                'data' => $projects['data'],
                'pagination' => HelperController::getPagination($projects)
            ], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Get(
     *     path="/api/v1/projects/{id}",
     *       tags={"Projects"},
     *       summary="Get one project",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Show info about project"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Project id",
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
    public function show(ProjectRequest $id)
    {
        if ($project = Project::with('companies')->findOrFail($id)) return response()->json(['data' => $project], StatusCode::SUCCESS);
    }


    /**
     * @OA\Post(
     *     path="/api/v1/projects",
     *       tags={"Projects"},
     *       summary="Create new project",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Project has been created successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  required={"name"},
     *                  @OA\Property(property="name", type="string"),
     *                  @OA\Property(
     *                      property="company_arr",
     *                      type="array",
     *                      @OA\Items(type="integer")
     *                  ),
     *             )
     *         )
     *      ),
     *)
     */
    public function store(ProjectRequest $request)
    {
        $request_data = $request->all();

        $project = Project::create($request_data);

        //Sync companies
        if ($request->filled('company_arr'))
            $project->companies()->sync($request->get('company_arr'));

        if ($project->save()) return response()->json(['data' => $project], StatusCode::SUCCESS);

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Put(
     *     path="/api/v1/projects/{id}",
     *       tags={"Projects"},
     *       summary="Update project",
     *       description="Please use method POST and add to form request field '_method' with value 'PUT'.",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Project has been updated successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Project id",
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
     *                  @OA\Property(
     *                      property="company_arr",
     *                      type="array",
     *                      @OA\Items(type="integer")
     *                  ),
     *             )
     *         )
     *      ),
     *)
     */
    public function update(ProjectRequest $request, $id)
    {
        if ($project = Project::findOrFail($id)) {

            $project->fill($request->all());

            //Sync companies
            if ($request->filled('company_arr'))
                $project->companies()->sync($request->get('company_arr'));

            if ($project->save()) {
                $project->refresh();
                return response()->json(['data' => $project], StatusCode::SUCCESS);
            }
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Delete(
     *     path="/api/v1/projects/{id}",
     *       tags={"Projects"},
     *       summary="Delete project",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Project has been deleted successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Project id",
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
        if ($project = Project::findOrFail($id)) {
            if ($project->delete()) return response()->json(['message' => 'Project has been deleted'], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Post(
     *     path="/api/v1/projects/restore/{id}",
     *       tags={"Projects"},
     *       summary="Restore deleted project",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Project has been restored successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Project id",
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
        if ($project = Project::onlyTrashed()->find($id)) {
            if ($project->restore()) return response()->json(['message' => 'Project has been restored'], StatusCode::SUCCESS);
        }
        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }
}
