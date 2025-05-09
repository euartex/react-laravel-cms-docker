<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\CallbackEndpoint;
use App\Enums\StatusCode;
use App\Http\Requests\CallbackEndpointRequest;

class CallbackEndpointController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/callback-endpoints",
     *       tags={"Callback endpoints"},
     *       summary="Get list of callback endpoints",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of callback endpoints"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *)
     */
    public function index()
    {
        return  $this->successResponse(CallbackEndpoint::all(),null, StatusCode::SUCCESS);
    }


    /**
     * @OA\Post(
     *     path="/api/v1/callback-endpoints",
     *       tags={"Callback endpoints"},
     *       summary="Create new callback endpoint",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Callback endpoint has been created successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                   required={"url"},
     *                  @OA\Property(property="url"),
     *             )
     *         )
     *      ),
     *)
     */
    public function store(CallbackEndpointRequest $request)
    {

        $result = CallbackEndpoint::create($request->all());

        return  $result ? $this->successResponse($result,'Callback endpoint has been created successfully!', StatusCode::SUCCESS) : $this->errorResponse(StatusCode::BAD_REQUEST, 'Callback endpoint hasn\'t been created!');
    }


    /**
     * @OA\Get(
     *     path="/api/v1/callback-endpoints/{id}",
     *       tags={"Callback endpoints"},
     *       summary="Get specific callback endpoint",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Callback endpoint has been loaded"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Callback endpoint id",
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
    public function show(CallbackEndpoint $id)
    {
        $result = CallbackEndpoint::find($id);

        return $result ? $this->successResponse($result,null, StatusCode::SUCCESS) : $this->errorResponse(StatusCode::BAD_REQUEST, 'Callback endpoint not found!');
    }

    /**
     * @OA\Put(
     *     path="/api/v1/callback-endpoints/{id}",
     *       tags={"Callback endpoints"},
     *       summary="Update specific callback endpoint",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Callback endpoint has been updated successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Callback endpoint id",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64",
     *         ),
     *      ),
     *     @OA\Parameter(
     *         description="Url string",
     *         in="query",
     *         name="url",
     *         required=false,
     *         @OA\Schema(
     *             type="string"
     *         ),
     *      ),
     *
     *)
     */
    public function update(CallbackEndpointRequest $request, $id)
    {
        $callback_endpoint = CallbackEndpoint::findOrFail($id);
        $callback_endpoint->fill($request->all());

        return $callback_endpoint->save() ? $this->successResponse($callback_endpoint->fresh(),'Callback endpoint has been updated!', StatusCode::SUCCESS) : $this->errorResponse(StatusCode::BAD_REQUEST, 'Callback endpoint hasn\'t been updated!');
    }


    /**
     * @OA\Delete(
     *     path="/api/v1/callback-endpoints/{id}",
     *       tags={"Callback endpoints"},
     *       summary="Delete specific callback endpoint",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Callback endpoint has been deleted successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Callback endpoint id",
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
    public function destroy(CallbackEndpointRequest $request, $id)
    {

        if($result = CallbackEndpoint::findOrFail($id)) $result->delete();

        return $this->successResponse(null,'Callback endpoint has been deleted successful!', StatusCode::SUCCESS);
    }


    /**
     * @param CallbackEndpointRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function debug(CallbackEndpointRequest $request)
    {
        //Log::info(print_r($request->all(), true));
        return $this->successResponse($request->all(),'Response',StatusCode::SUCCESS);
    }
}
