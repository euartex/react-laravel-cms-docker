<?php

namespace App\Http\Controllers\API\V1;

use App\Enums\StatusCode;
use App\Helpers\HelperController;
use App\Http\Requests\AppUserRequest;
use App\AppUser;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use App\Services\WPService\WPUser;


class AppUserController extends Controller
{
     /**
     * @OA\Get(
     *     path="/api/v1/app-users",
     *       tags={"App users"},
     *       summary="Get list of all App users",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of App users has been got"),
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
    public function index(AppUserRequest $request)
    { 

        if (!$request->filled('limit')) $limit = 20; else $limit = request('limit');

        $users = AppUser::listSelect()->search(request('q'),null, true, true);

        if ($users = $users->paginate($limit)) {
                $users = $users->toArray();

                return response()->json([
                    'data' => $users['data'],
                    'pagination' => HelperController::getPagination($users)
                ], StatusCode::SUCCESS);
            }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/app-users/{id}",
     *       tags={"App users"},
     *       summary="Get App user",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="App users has been got"),
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
        if($user = AppUser::findOrFail($id)) return response()->json(['data' => $user], StatusCode::SUCCESS);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/app-users",
     *       tags={"App users"},
     *       summary="Create new App user",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="App user has been created successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                   required={"email", "password"},
     *                  @OA\Property(property="email",   type="string"),
     *                  @OA\Property(property="first_name", type="string"),
     *                  @OA\Property(property="last_name", type="string"),
     *                  @OA\Property(property="password", type="string"),
     *                  @OA\Property(property="newsletter", type="boolean"),
     *             )
     *         )
     *      ),
     *)
     */
    public function store(AppUserRequest $request, WPUser $WPUser)
    {
        $request = $request->all();
        $request['password'] = Hash::make(request('password'));
        $request['newsletter'] = filter_var(request('newsletter'), FILTER_VALIDATE_BOOLEAN);

        if ($user = AppUser::create($request)) {
            $WPUser->create($user, request('password'));
            //$user->sendEmailVerificationNotification(); //Send verification email
            return response()->json(['data' => $user], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }

     /**
     * @OA\Put(
     *     path="/api/v1/app-users/{id}",
     *       tags={"App users"},
     *       summary="Update App user",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="App user has been updated successfully"),
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
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  @OA\Property(property="email",   type="string"),
     *                  @OA\Property(property="first_name", type="string"),
     *                  @OA\Property(property="last_name", type="string"),
     *                  @OA\Property(property="password", type="string"),
     *                  @OA\Property(property="newsletter", type="boolean"),
     *             )
     *         )
     *      ),
     *)
     */
    public function update(AppUserRequest $request, $id, WPUser $WPUser)
    {
        if($user = AppUser::findOrFail($id)){

            $WPUser->update($user, $request->except('password'));

            $user->fill($request->all());

            if($request->filled('password')) {
                $WPUser->update($user, ['newpassword' => request('password')]);
                $user->password = Hash::make(request('password'));
            }

            if($user->save()){

                $user->refresh();
                return response()->json(['data' => $user], StatusCode::SUCCESS);
            }
        }
    }

     /**
     * @OA\Delete(
     *     path="/api/v1/app-users/{id}",
     *       tags={"App users"},
     *       summary="Delete App user",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="App users has been deleted"),
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
    public function destroy($id, WPUser $WPUser)
    {
        if($user = AppUser::findOrFail($id)){
            $WPUser->delete($user);

            if($user->delete()) return response()->json(['message' => 'App user has been deleted'], StatusCode::SUCCESS);

        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }
}
