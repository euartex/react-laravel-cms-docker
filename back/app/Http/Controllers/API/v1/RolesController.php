<?php

namespace App\Http\Controllers\API\V1;

use App\Enums\StatusCode;
use App\Helpers\HelperController;
use App\Http\Requests\RoleRequest;
use App\Role;
use App\Permission;
use App\Http\Controllers\Controller;


class RolesController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/v1/roles",
     *       tags={"Roles"},
     *       summary="Create new role user",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="The role has been created successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="application/json",
     *              @OA\Schema(
     *                  required={ "name"},
     *                  @OA\Property(property="name",   type="string"),
     *                  @OA\Property(property="permissions", type="array",
     *                          @OA\Items(oneOf={@OA\Schema(
     *                              @OA\Property(property="permission_id",   type="integer"),
     *                              @OA\Property(property="allow", type="bool",
     *                                   @OA\Items(type="string",  enum={"", "edit","view"}),
     *                               ),
     *                          )},
     *                      ),
     *                  ),
     *             )
     *         )
     *     ),
     *)
     */
    public function store(RoleRequest $request)
    {
        if ($role = Role::create(['name' => request('name'), 'slug' => request('name')])){

            $permission_arr = [];

            foreach(request('permissions') as $permission) $permission_arr[$permission['permission_id']] = ['allow' => $permission['allow']];

            $role->permissions()->sync($permission_arr, false);

            return response()->json(['data' => $role], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }

     /**
     * @OA\Put(
     *     path="/api/v1/roles/{id}",
     *       tags={"Roles"},
     *       summary="Update specific role user",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="The role has been updated successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Id of role",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64",
     *         ),
     *     ),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="application/json",
     *              @OA\Schema(
     *                 required={ "name"},
     *                  @OA\Property(property="name",   type="string"),
     *                  @OA\Property(property="permissions", type="array",
     *                          @OA\Items(oneOf={@OA\Schema(
     *                              @OA\Property(property="permission_id",   type="integer"),
     *                              @OA\Property(property="allow", type="bool",
     *                                   @OA\Items(type="string",   enum={"", "edit","view"}),
     *                               ),
     *                          )},
     *                      ),
     *                  ),
     *             )
     *         )
     *     ),
     *)
     */
    public function update(RoleRequest $request, $id)
    {
        if ($role = Role::excludeSuperAdminRole()->findOrFail($id)){

            $role->update(['name' => request('name'), 'slug' => request('name')]);

            $permissions = collect([]);

            collect(request('permissions'))->each(function ($permission, $key) use ($permissions){

                $permissions[$permission['permission_id']] = ['allow' => $permission['allow']];
            });

 
      
            $role->permissions()->sync($permissions);

            $role = $role->refresh();

            return response()->json(['data' => $role], StatusCode::SUCCESS);
        }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }

     /**
     * @OA\Get(
     *     path="/api/v1/roles",
     *       tags={"Roles"},
     *       summary="Get list of all roles",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of roles has been got"),
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
    public function index(RoleRequest $request)
    {

        return $this->getRoles($request);
    }


     /**
     * @OA\Get(
     *     path="/api/v1/roles/accessible-roles-list",
     *       tags={"Roles"},
     *       summary="Accessible list of all roles",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of roles has been got"),
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
    public function list(RoleRequest $request)
    {

        return $this->getRoles($request);
    }

    public function getRoles(RoleRequest $request)
    {

        if (!$request->filled('limit')) $limit = 20; else $limit = request('limit');

        $role = Role::excludeSuperAdminRole()->listSelect()->search(request('q'),null, true, true);

        if ($role = $role->paginate($limit)) {
                $role = $role->toArray();

                return response()->json([
                    'data' => $role['data'],
                    'pagination' => HelperController::getPagination($role)
                ], StatusCode::SUCCESS);
            }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }

     /**
     * @OA\Get(
     *     path="/api/v1/roles/permissions",
     *       tags={"Roles"},
     *       summary="Get list of all permissions",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="List of permissions has been got"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *)
     */
    public function getPermissionsList()
    {
        if ($permission = Permission::get()) {

                return response()->json([
                    'data' => $permission,
                ], StatusCode::SUCCESS);
            }

        return response()->json(['message' => 'Bad request'], StatusCode::BAD_REQUEST);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/roles/{id}",
     *       tags={"Roles"},
     *       summary="Get specific role",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="The role has been got"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Parameter(
     *         description="Role id",
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
        if($role = Role::excludeSuperAdminRole()->findOrFail($id)) return response()->json(['data' => $role], StatusCode::SUCCESS);
    }


     /**
     * @OA\Delete(
     *     path="/api/v1/roles/{id}",
     *       tags={"Roles"},
     *       summary="Role delete",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="The role has been deleted"),
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
        if($role = Role::excludeSuperAdminRole()->findOrFail($id)){

            if($role->delete()) return response()->json(['message' => 'The role has been deleted'], StatusCode::SUCCESS);
        }
    }
}
