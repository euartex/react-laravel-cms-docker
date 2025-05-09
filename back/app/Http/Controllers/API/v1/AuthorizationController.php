<?php

namespace App\Http\Controllers\API\V1;

use App\Helpers\HelperController;
use App\Http\Controllers\Controller;
use App\Http\Requests\AuthRequest;
use Config;
use App\User;
use Illuminate\Support\Facades\Auth;
use GuzzleHttp\Client;
use App\Enums\StatusCode;
use Illuminate\Database\Eloquent\Builder;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Laravel\Passport\Client as OClient;

class AuthorizationController extends Controller
{
    private $password_client = 1;
    private $oauth_client_id = 2;
    private $oauth_client;


    public function __construct()
    {
        $this->oauth_client = OClient::where('password_client', $this->password_client)->find($this->oauth_client_id);
    }


    /**
     * @OA\Post(
     *     path="/api/v1/auth",
     *       tags={"Authorization"},
     *       summary="User auth by email and password",
     *     @OA\Response(response="200", description="Updated successful"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                    required={"password","email"},
     *                  @OA\Property(property="email", description="email", title="email", type="string"),
     *                  @OA\Property(property="password", type="string"),
     *
     *             )
     *         )
     *      ),
     *)
     */
    public function authenticate(AuthRequest $request)
    {
        if (Auth::attempt(['email' => request('email'), 'password' => request('password')])) {
            return response()->json([
                'data' => [
                    'session' => $this->getAuthToken($this->oauth_client, ['email' => request('email'), 'password' => request('password'), 'scopes' => '*']),
                    'user' => Auth::user()
                ]
            ], StatusCode::SUCCESS
            );
        }

        return response()->json([
            'message' => 'Wrong credentials'
        ], StatusCode::BAD_REQUEST
        );
    }


    /**
     * @OA\Post(
     *     path="/api/v1/auth/logout",
     *       tags={"Authorization"},
     *       summary="User logout",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="User has been logged out successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *)
     */
    public function logout()
    {
        if (Auth::check()) {
            if (Auth::user()->oauthAccessToken()->delete()) {
                return response()->json([
                    'message' => 'You\'ve been logged out successfully'
                ], StatusCode::SUCCESS
                );
            }
        }

        return response()->json([
            'message' => 'Bad request'
        ], StatusCode::BAD_REQUEST
        );
    }


    /**
     * @OA\Post(
     *     path="/api/v1/auth/auth-token-refresh",
     *       tags={"Authorization"},
     *       summary="Get auth token by refresh",
     *     @OA\Response(response="200", description="The auth token has been got successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                    required={"refresh_token"},
     *                  @OA\Property(property="refresh_token", description="refresh token", title="refresh token", type="string"),
     *             )
     *         )
     *      ),
     *)
     */
    public function tokenRefresh(AuthRequest $request)
    {
        if ($this->oauth_client) return $this->getAuthToken($this->oauth_client, null, request('refresh_token'));

        return response()->json([
            'message' => 'Bad request'
        ], StatusCode::BAD_REQUEST
        );
    }


    /**
     * Get refresh and auth tokens
     *
     * @param $oClient [instance of OClient]. $user_creds['email' => '', 'password' => '', 'scopes' => '*'], $refresh_token[string]
     *
     * @return Json
     */
    public function getAuthToken(OClient $oClient, $user_creds, $refresh_token = null)
    {

        if ($oClient) {

            $http = new Client([
                'verify' => false //Disable ssl verify for self signed certificate
            ]);

            try {
                $response = $http->request('POST', Config::get('app.url') . '/oauth/token', [
                    //'debug' => true,
                    'form_params' => [
                        'client_id' => $oClient->id,
                        'client_secret' => $oClient->secret,
                        'grant_type' => (($refresh_token === null) ? 'password' : 'refresh_token'),
                        'refresh_token' => $refresh_token,
                        'username' => $user_creds['email'] ?? null,
                        'password' => $user_creds['password'] ?? null,
                        'scope' => $user_creds['scopes'] ?? null,
                    ],
                ]);
            } catch (RequestException $e) {
                throw new NotFoundHttpException((($refresh_token === null) ? 'Can\'t generate "Access" and "Refresh" tokens . Error: '. $e : '"Refresh" token not found'));
            }

            if ($response) {
                return json_decode((string)$response->getBody(), true);
            }

        }

        return response()->json([
            'message' => 'Bad request'
        ], StatusCode::BAD_REQUEST
        );
    }
}
