<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use App\Enums\StatusCode;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class VerificationController extends Controller
{

    public function __construct()
    {
        $this->middleware('signed')->only('verify');
    }

    /**
     * @OA\Get(
     *     path="/api/v1/cms-users/verification",
     *     deprecated=true,
     *       tags={"Email verification"},
     *       summary="User email verify",
     *     @OA\Response(response="200", description="Email has beed verified successful"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Response(response="500", description="Server error"),
     *)
     */
    public function verify(Request $request)
    {
        if ($request->hasValidSignature()){
            $user = Auth::loginUsingId($request->id);
            if($user->email_verified_at == null) {
                $user->markEmailAsVerified();
                event(new Verified($user));
                return response()->json(['message' => 'Email verified!']);
            }
            return response()->json(['message' => 'Email already verified!']);
        }

        return response()->json(['message' => 'Email verification error'], StatusCode::BAD_REQUEST);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/cms-users/verification",
     *       tags={"Email verification"},
     *       summary="Resend email with code",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Email with verification code has beed sent successful"),
     *     @OA\Response(response="422", description="User already have verified email"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Response(response="500", description="Server error"),
     *
     *)
     */
    public function send(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'User already have verified email!'], StatusCode::VALIDATION_ERROR);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'The notification has been resubmitted'], StatusCode::SUCCESS);
    }
}
