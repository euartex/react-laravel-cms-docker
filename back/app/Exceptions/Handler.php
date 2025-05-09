<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Exception\RouteNotFoundException;
use Symfony\Component\ErrorHandler\Error\FatalError;
use Illuminate\Database\QueryException;
use GuzzleHttp\Exception\ClientException;
use RuntimeException;
use App\Enums\StatusCode;

class Handler extends ExceptionHandler
{


    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        \League\OAuth2\Server\Exception\OAuthServerException::class,
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Throwable  $exception
     * @return void
     *
     * @throws \Exception
     */
    public function report(Throwable $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Throwable
     */
    public function render($request, Throwable $exception)
    {   if ($exception instanceof RuntimeException OR $exception instanceof ModelNotFoundException OR $exception instanceof NotFoundHttpException OR $exception instanceof RouteNotFoundException) {
            return response()->json(['message' => (($exception->getMessage() === '') ? 'Not found' : $exception->getMessage())], StatusCode::NOT_FOUND);
        }

        if ($exception instanceof FatalError OR $exception instanceof QueryException OR $exception instanceof ClientException) {
            return response()->json(['message' => $exception->getMessage()], StatusCode::FATAL_ERROR);
        }

        return parent::render($request, $exception);
    }
}
