<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\AppUser;
use App\Http\Requests\AppUserPasswordResetRequest;

class AppUserPasswordResetController extends Controller
{
    private $reset_password;
    private $user;

    public function __construct(){

        $this->reset_password = new \App\Http\Controllers\API\v1\PasswordResetController();
        $this->user = new AppUser();

    }
      /**
     * @OA\Post(
     *     path="/api/v1/app-users/reset-password/create",
     *       tags={"Reset App user password"},
     *       summary="Get reset password token by email",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Email with instructions has been sent  successful"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                    required={"email"},
     *                  @OA\Property(property="email", description="email", title="email", type="string"),
     *
     *             )
     *         )
     *      ),
     *)
     */
    public function appUserResetPasswordCreate(AppUserPasswordResetRequest $request)
    {
        return $this->reset_password->create(request('email'), $this->user);
    }

     /**
     * @OA\Post(
     *     path="/api/v1/app-users/reset-password/reset",
     *       tags={"Reset App user password"},
     *       summary="Create new user password",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Password has been updated successful"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  required={"new_password", "token"},
     *                  @OA\Property(property="new_password",  description="new_password", title="new_password",   type="string"),
     *                  @OA\Property(property="token",  description="token", title="token",  type="string"),
     *
     *             ),
     *         ),
     *      ),
     *)
     */
    public function appUserResetPasswordReset(AppUserPasswordResetRequest $request)
    {
        return $this->reset_password->reset(request('token'), $this->user, $request->new_password);
    }
}
