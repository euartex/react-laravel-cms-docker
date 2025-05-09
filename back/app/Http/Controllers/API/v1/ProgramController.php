<?php

namespace App\Http\Controllers\API\v1;

use App\Enums\ProgramType;
use App\Enums\StatusCode;
use App\Helpers\HelperController;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProgramRequest;
use App\Program;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class ProgramController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/v1/programs/types/accessible-list",
     *       tags={"Programs"},
     *       summary="Get list of progtam types (accessible)",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of programs types has been got"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *)
     */

    public function list(ProgramRequest $request)
    {
        return $this->getTypes();
    }

    /**
     * @OA\Get(
     *     path="/api/v1/programs/types",
     *       tags={"Programs"},
     *       summary="Get list of progtam types",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of programs types has been got"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *)
     */

    public function types(ProgramRequest $request)
    {
        return $this->getTypes();
    }

    public function getTypes()
    {
        $types = ProgramType::getValues();

        if($types)
            return response()->json(['data' => $types], StatusCode::SUCCESS);

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Get(
     *     path="/api/v1/programs",
     *       tags={"Programs"},
     *       summary="Get list of all programs",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of programs has been got"),
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
    public function index(ProgramRequest $request)
    {
        $project_id = request('project_id');

        if (!$request->filled('limit')) $limit = 20; else $limit = request('limit');

        $programs = Program::whereHas('project', function (Builder $query) use ($project_id, $request) {
            if ($request->filled('project_id')) {
                $query->whereId($project_id);
            }
        })->orderBy('id');

        if ($request->filled('sortDesc')) $programs = $programs->multisort(request('sortDesc'), 'DESC');
        if ($request->filled('sort')) $programs = $programs->multisort(request('sort'), 'ASC');

        if ($request->filled('q'))
            $programs = $programs->search(request('q'),null, true, true);

        if ($programs = $programs->paginate($limit)) {
            $programs = $programs->toArray();

            return response()->json([
                'data' => $programs['data'],
                'pagination' => HelperController::getPagination($programs)
            ], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Get(
     *     path="/api/v1/programs/{id}",
     *       tags={"Programs"},
     *       summary="Get one program",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Show info about program"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Program id",
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
    public function show(ProgramRequest $id)
    {
        if ($program = Program::with(['show','project'])->findOrFail($id)) return response()->json(['data' => $program], StatusCode::SUCCESS);
    }


    /**
     * @OA\Post(
     *     path="/api/v1/programs",
     *       tags={"Programs"},
     *       summary="Create new program",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Program has been created successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  required={"name",  "project_id", "show_id","start_show_at","end_show_at", "type"},
     *                  @OA\Property(property="name", type="string"),
     *                  @OA\Property(property="project_id", type="integer"),
     *                  @OA\Property(property="show_id", type="integer"),
     *                  @OA\Property(property="start_show_at", type="time"),
     *                  @OA\Property(property="end_show_at", type="time"),
     *                  @OA\Property(property="type", type="integer"),
     *                  ),
     *             )
     *         )
     *      ),
     *)
     */
    public function store(ProgramRequest $request)
    {

        $program = Program::create($request->all());

        if ($program->save()) return response()->json(['data' => $program], StatusCode::SUCCESS);

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }



    /**
     * @OA\Put(
     *     path="/api/v1/programs/{id}",
     *       tags={"Programs"},
     *       summary="Update program",
     *       description="Please use method POST and add to form request field '_method' with value 'PUT'.",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Program has been updated successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Program id",
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
     *                  @OA\Property(property="project_id", type="integer"),
     *                  @OA\Property(property="show_id", type="integer"),
     *                  @OA\Property(property="start_show_at", type="time"),
     *                  @OA\Property(property="end_show_at", type="time"),
     *                  @OA\Property(property="type", type="integer"),
     *             )
     *         )
     *      ),
     *)
     */
    public function update(ProgramRequest $request, $id)
    {
        if ($program = Program::findOrFail($id)) {

            $program->fill($request->all());

            if ($program->save()) {

                $program->refresh();

                return response()->json(['data' => $program], StatusCode::SUCCESS);
            }
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Delete(
     *     path="/api/v1/programs/{id}",
     *       tags={"Programs"},
     *       summary="Delete program",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Program has been deleted successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Program id",
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
        if ($program = Program::findOrFail($id))  if ($program->delete()) return response()->json(['message' => 'Program has been deleted'], StatusCode::SUCCESS);

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }
}
