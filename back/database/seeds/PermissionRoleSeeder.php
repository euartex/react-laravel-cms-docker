<?php

use Illuminate\Database\Seeder;
use App\Permission;
use App\PermissionRole;

class PermissionRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Permission::All()->each(function ($permission) {

            $manager = PermissionRole::updateOrCreate(
                [
                    'role_id' => 1,
                    'permission_id' => $permission->id,
                ],
                [
                    'role_id' => 1,
                    'permission_id' => $permission->id,
                    'allow' => true
                ]
            );
        });
    }
}
