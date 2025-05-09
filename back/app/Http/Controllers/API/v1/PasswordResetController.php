<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\PasswordReset;
use App\Enums\StatusCode;
use Carbon\Carbon;
use Illuminate\Support\Str;
use App\Notifications\PasswordResetSuccess;
use App\Notifications\PasswordResetRequest as PasswordResetNotification;

class PasswordResetController extends Controller
{

    public function create($email, $user_model)
    {
        if ($user = $user_model->whereEmail($email)->select('email', 'id')->first()){
	        $passwordReset = PasswordReset::updateOrCreate(
	            ['email' => $user->email], [
	                'email' => $user->email,
	                'token' => Str::random(60)
	            ]
	        );
    	}

        if (isset($passwordReset) and $passwordReset){

        	try{

	            $user->notify(new PasswordResetNotification($passwordReset->token));

		        return response()->json(['message' => 'We have emailed your password reset link'], StatusCode::SUCCESS);

		    }catch(\Exception $e){

                \Log::error('The password reset email has not been sent!');
                \Log::debug($e->getMessage());

                return response()->json(['message' => $e->getMessage()], StatusCode::BAD_REQUEST);
            }
    	}

    	return response()->json(['message' => 'We can\'t find a user with that email address'], StatusCode::BAD_REQUEST);
    }


    /**
     * @OA\Get(
     *     path="/api/v1/reset-password/find/{token}",
     *       tags={"Reset password"},
     *       summary="Check reset password token",
     *     @OA\Response(response="200", description="Token  has been found  successful"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Parameter(
     *         description="Password reset token",
     *         in="path",
     *         name="token",
     *         required=true,
     *         @OA\Schema(
     *             type="string",
     *         ),
     *      ),
     *)
     */
    public function find($token)
    {
        if ($passwordReset = PasswordReset::whereToken($token)->first()){

	        if (! Carbon::parse($passwordReset->updated_at)->addMinutes(720)->isPast()) {

	            return response()->json([
	            	$passwordReset
	            ], StatusCode::SUCCESS);
	        }

            $passwordReset->delete();

	        return response()->json([
		        'message' => 'This password reset token is timeout'
		    ], StatusCode::BAD_REQUEST);
	    }

	    return response()->json([
	        'message' => 'This password reset token is invalid'
	    ], StatusCode::BAD_REQUEST);
    }



    public function reset($token, $user_model, $newPassword)
    {
        if ($passwordReset = PasswordReset::where([['token', $token]])->first()){

	        if ($user = $user_model->whereEmail($passwordReset->email)->select('id')->first()){
		        $user->password = bcrypt($newPassword);
		        $user->save();

		        $passwordReset->delete();

		        $user->notify(new PasswordResetSuccess());

		        return response()->json([
		        	'message' => 'Password has been updated successful'], StatusCode::SUCCESS
		        );
		    }

		    return response()->json([
	                'message' => 'We can\'t find a user with that email address'
	            ], StatusCode::BAD_REQUEST
	        );
	    }

	    return response()->json([
	        'message' => 'This password reset token is invalid'
	    ], StatusCode::BAD_REQUEST);
    }
}
