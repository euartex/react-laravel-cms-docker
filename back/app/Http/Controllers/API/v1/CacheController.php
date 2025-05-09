<?php

namespace App\Http\Controllers\API\v1;

use App\Enums\StatusCode;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Artisan;

class CacheController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/v1/cache/clear",
     *       tags={"Cache"},
     *       summary="Clear all cache",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="The cache  has been cleared successfully"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *)
     */
    public function clear()
    {
        Artisan::call('optimize:clear'); 

        return response()->json(['message' =>  Artisan::output()], StatusCode::SUCCESS);
    }
}