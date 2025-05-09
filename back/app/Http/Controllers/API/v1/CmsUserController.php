<?php

namespace App\Http\Controllers\API\V1;

use App\Enums\StatusCode;
use App\Helpers\HelperController;
use App\Http\Requests\CmsUserRequest;
use App\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;


class CmsUserController extends Controller
{
     /**
     * @OA\Get(
     *     path="/api/v1/cms-users",
     *       tags={"CMS users"},
     *       summary="Get list of all CMS users",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of CMS users has been got"),
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
    public function index(CmsUserRequest $request)
    {

        if (!$request->filled('limit')) $limit = 20; else $limit = request('limit');

        $users = User::listSelect();

        /**
        *   Serching
        */
        if ($request->filled('q')) $users->search(request('q'),null, true, true);

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
     *     path="/api/v1/cms-users/{id}",
     *       tags={"CMS users"},
     *       summary="Get CMS user",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="CMS users has been got"),
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
        if($user = User::findOrFail($id)) return response()->json(['data' => $user], StatusCode::SUCCESS);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/cms-users",
     *       tags={"CMS users"},
     *       summary="Create new CMS user",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="CMS user has been created successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  required={"email", "password",   "role_id"},
     *                  @OA\Property(property="email",   type="string"),
     *                  @OA\Property(property="first_name", type="string"),
     *                  @OA\Property(property="last_name", type="string"),
     *                  @OA\Property(property="password", type="string"),
     *                  @OA\Property(property="phone", type="string"),
     *                  @OA\Property(property="company_ids", type="array",
     *                      @OA\Items(type="integer"),
     *                  ),
     *                  @OA\Property(property="role_id", type="integer"),
     *
     *             )
     *         )
     *      ),
     *)
     */
    public function store(CmsUserRequest $request)
    {

        $columns = $request->all();
        $columns['password'] = Hash::make(request('password'));

        if ($user = User::create($columns)) {

            if($request->filled('company_ids')) $user->companies()->sync(request('company_ids'));

            $user->sendEmailVerificationNotification(); //Send verification email

            return response()->json(['data' => $user], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }

     /**
     * @OA\Put(
     *     path="/api/v1/cms-users/{id}",
     *       tags={"CMS users"},
     *       summary="Update CMS user",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="CMS user has been updated successfully"),
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
     *                  @OA\Property(property="phone", type="string"),
     *                  @OA\Property(property="company_ids", type="array",
     *                      @OA\Items(type="integer"),
     *                  ),
     *                  @OA\Property(property="role_id", type="integer"),
     *             )
     *         )
     *      ),
     *)
     */
    public function update(CmsUserRequest $request, $id)
    {
        if($user = User::findOrFail($id)){

            $user->fill($request->all());

            if($request->filled('password')) $user->password = Hash::make(request('password'));

            if($request->filled('company_ids')) $user->companies()->sync(request('company_ids'));

            if($user->save()){

                $user->refresh();
                return response()->json(['data' => $user], StatusCode::SUCCESS);
            }
        }
    }

    /**
     * @OA\Put(
     *     path="/api/v1/cms-users/me/update",
     *       tags={"CMS users"},
     *       summary="Update current CMS user",
     *       description="Please use method POST and add to form request field '_method' with value 'PUT'.",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="User has been updated successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  @OA\Property(property="password", type="string"),
     *                  @OA\Property(property="new_password", type="string"),
     *             )
     *         )
     *      ),
     *)
     */
    public function updateMe(CmsUserRequest $request)
    {
        if($user = Auth::user()){

            //Update password
            if($request->filled('new_password')) {
                if(!Hash::check($request->get('password'),$user->password))
                    return response()->json(['message' => 'Old password incorrect'], StatusCode::BAD_REQUEST);
                $user->password = Hash::make(request('new_password'));
            }

            if($user->save()){
                $user->refresh();
                return response()->json(['data' => $user], StatusCode::SUCCESS);
            }
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }

     /**
     * @OA\Delete(
     *     path="/api/v1/cms-users/{id}",
     *       tags={"CMS users"},
     *       summary="Delete CMS user",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="CMS users has been deleted"),
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
        if($user = User::findOrFail($id)){

            if($user->delete()) return response()->json(['message' => 'CMS user has been deleted'], StatusCode::SUCCESS);
        }
    }
}
