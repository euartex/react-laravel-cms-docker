<?php

use App\Permission;
use App\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;
use App\User;

/**
 * Class CallbackEndpointAdminSeeder
 */
class CallbackEndpointAdminSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /**
         * Access for user witch has permissions to access to callback endpoint routes
         */
        $email = 'callback@domain.com';
        $password = 'g5g45gd45DFGgdfsll';

        if(!$user = User::whereEmail($email)->first()) {

            $user = User::create([

                    /**
                     * Cms user for access to callback endpoints
                     */
                    'email' => $email,
                    'first_name' => 'Callback',
                    'password' => Hash::make($password),
                    'role_id' => factory(Role::class)->create([
                        'name' => 'Callback',
                        'slug' => 'callback'
                    ])->id
                ]
            );
        }

        /**
         * Adjusting permissions to roles
         */
        $permissions_arr = [];
        $permissions = Permission::where('slug', 'LIKE', "%callback%")->orWhere('slug', 'LIKE', "%event%")->get();

        $permissions->each(function ($permission) use (&$permissions_arr){

            $permissions_arr[$permission->id] = [
                'actions' => 'edit,view',
            ];

        });

        if($role = $user->role) $role->permissions()->syncWithoutDetaching($permissions_arr);
    }
}