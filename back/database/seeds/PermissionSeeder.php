<?php

use App\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create all permissions
    	collect(Route::getRoutes()->getRoutes())->reduce(
    	    function ($carry = [], $route, $middleware = 'permission') {
                foreach ($route->middleware() as $value) {
                    if (Str::startsWith($value, $middleware)) {
                        $middleware_attr = explode(':',  $value);
                        $middleware_attr = explode(',',  $middleware_attr[1] ?? null);

                        Permission::updateOrCreate(
                            [
                                'slug' => trim($route->getName()) ?? null,
                            ],
                            [
                                'group' => trim($middleware_attr[0]) ?? null,
                                'name' => trim($middleware_attr[1]) ?? null,
                            ]
                        );
                    }
                }
    	    }
        );
    }
}
