<?php

namespace App\Http\Middleware;
use App\Contracts\PermissionMiddleware;
use Closure;

class Permission implements PermissionMiddleware
{
    /**
     * Handle an incoming request.
     * @param $request
     * @param Closure $next
     * @param null $permission
     * @return mixed
     */
    public function handle($request, Closure $next, string $group = null, string $name = null)
    {  
        if(!auth()->user()->hasPermission(['route' => $request->route()->getName(), 'permission_allow' => true])) abort(404);

        return $next($request);
    }
}
