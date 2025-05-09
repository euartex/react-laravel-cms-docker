<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use App\Traits\ApiResponse;


class Controller extends BaseController
{
    /**
	 * @OA\Info(title="CMS API", version="1.0")
	 */
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests, ApiResponse;

}
