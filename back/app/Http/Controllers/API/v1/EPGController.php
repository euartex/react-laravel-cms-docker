<?php

namespace App\Http\Controllers\API\v1;

use App\Enums\StatusCode;
use App\Helpers\Import;
use App\Http\Requests\EpgRequest;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use SimpleXLSX;
use App\Show;



class EPGController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/v1/epg/import",
     *       tags={"EPG"},
     *       summary="Import",
     *     @OA\Response(response="200", description="Import  has been done"),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="500", description="Server error"),
     *     @OA\Response(response="401", description="Unauthorized"),
     *     @OA\Response(response="404", description="Not found"),
     *     @OA\RequestBody(
     *          @OA\MediaType(mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  required={"file"},
     *                  @OA\Property(property="file", description="xls, csv", type="file"),
     *             )
     *         )
     *      ),
     *)
     */
    public function import(EpgRequest $request) {

        $xlsx = SimpleXLSX::parse( $request->file('file'));

        $sheet_as_array =  $xlsx->rowsEx(1);
        $converted_array_descr = Import::parseDescriptionSheet($sheet_as_array);

        // Start transaction!
        DB::beginTransaction();
   
        foreach($converted_array_descr as $show_descr) {
            try {
                if(!Show::where('slug', str_slug($show_descr['title'], '-'))->first()) {
                    Import::createShow($show_descr);
                }
            }
            catch (ValidationException $e) {
                DB::rollback();
            }
        }

        foreach(Import::parseTimeSheet($xlsx->rowsEx(0)) as $date => $day) {
            foreach($day['list'] as $show_arr) {
                try {
                    Import::createProgram($show_arr);
                }
                catch (ValidationException $e) {
                    DB::rollback();
                }
            }
        }

        //End transaction
        DB::commit();

        return response()->json(['message' => 'Import completed successfully' ], StatusCode::SUCCESS);
    }

}
