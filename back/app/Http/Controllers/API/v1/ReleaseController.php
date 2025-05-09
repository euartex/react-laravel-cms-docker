<?php

namespace App\Http\Controllers\API\v1;

use App\Enums\StatusCode;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ReleaseController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/v1/release/info",
     *       tags={"Release"},
     *       summary="Get information about release on server",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="Show information"),
     *     @OA\Response(response="404", description="File json not found"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *)
     */

    public function information (Request $request)
    {

        $file = base_path().'/release.json';

        if(!file_exists($file))
            return response()->json([
                'message' => 'File not found'
            ], StatusCode::NOT_FOUND
            );


        $json = json_decode(file_get_contents($file));

        return response()->json([
            'data' => $json
        ], StatusCode::SUCCESS
        );
    }
}
