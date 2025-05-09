<?php

namespace App\Contracts;

use Closure;

interface PermissionMiddleware
{
    /**
     * @param $request
     * @param Closure $next
     * @param string|null $group
     * @param string|null $name
     * @return mixed
     */
    public function handle($request, Closure $next, string $group = null, string $name = null);
}