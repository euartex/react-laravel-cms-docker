<?php

namespace App\Http\Controllers\API\v1;

use App\Event;
use App\Enums\StatusCode;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Config;


class EventController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/v1/events",
     *       tags={"Events"},
     *       summary="Show list of all events",
     *     security={
     *         {"bearer": {}}
     *     },
     *     @OA\Response(response="200", description="The events has been got successfully", @OA\JsonContent(ref="#/components/schemas/Event")),
     *     @OA\Response(response="400", description="Bad request"),
     *     @OA\Response(response="401", description="Validation error"),
     *     @OA\Response(response="500", description="Server error"),
     *)
     **/
    public function index()
    {
        $events = Event::whereBetween('performed_at', [now()->subDays(config::get('event.eventShowTimout')), now()])->get();

        return  $this->successResponse($events,null, StatusCode::SUCCESS);
    }
}
