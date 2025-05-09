<?php

namespace App\Traits;


trait ApiResponse
{
    /**
     * @param $data
     * @param null $message
     * @param int $code
     * @return \Illuminate\Http\JsonResponse
     */
    protected function successResponse($data, $message = null, $code = 200)
    {
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => $data
        ], $code);
    }

    /**
     * @param $code
     * @param null $message
     * @return \Illuminate\Http\JsonResponse
     */
    protected function errorResponse($code, $message = null)
    {
        return response()->json([
            'status' => 'error',
            'message' => $message,
            'data' => null
        ], $code);
    }

    /**
     * @param int $code
     * @param null $message
     * @return \Illuminate\Http\JsonResponse
     */
    public function validationErrorResponse($code = 422, $message = null)
    {
        return response()->json([
            'status' => 'validationErrors',
            'validationErrors' => $message,
        ], $code);
    }
}