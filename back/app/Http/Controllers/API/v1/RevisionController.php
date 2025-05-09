<?php

namespace App\Http\Controllers\API\V1;

use App\Enums\StatusCode;
use App\Helpers\HelperController;
use App\Http\Requests\RevisionRequest;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;


class RevisionController extends Controller
{   
    /**
     * @OA\Get(
     *     path="/api/v1/revisions/{id}",
     *       tags={"Revisions"},
     *       summary="Get revision history",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="The revision has been got"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Id of model row",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64",
     *         ),
     *     ),
     *     @OA\Parameter(
     *         description="Model (asset, playlist, navigation)",
     *         in="query",
     *         name="model_type",
     *         required=true,
     *         @OA\Schema(
     *             type="string",
     *              enum={"asset","playlist","navigation"}
     *         ),
     *     ),
     *     @OA\Parameter(
     *         description="Limit items of history per page",
     *         in="query",
     *         name="limit",
     *         required=false,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64",
     *              default="20"
     *         ),
     *     ),
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
     *)
     */
    public function show(RevisionRequest $request, $id)
    {
        if (! $request->filled('limit')) $limit = 20; else $limit = request('limit');

        if($model = app("App".'\\'.ucfirst(request('model_type')))){

            if ($history = $model->findOrFail($id)->histories()->orderBy('id','DESC')->paginate($limit)) {
                
                $history->data = $history->map(function ($collection) {

                    if($user = $collection->user()) $collection->cms_user = $user->makeHidden(['role','company']);

                    return $collection;
                });

                $history = $history->toArray();

                return response()->json([
                    'data' => $history['data'],
                    'pagination' => HelperController::getPagination($history)
                ], StatusCode::SUCCESS);
            }
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }
}
