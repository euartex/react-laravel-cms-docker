<?php

use App\PermissionRole;
use Illuminate\Database\Seeder;

class SetAllExistsRolePermissionAsAllowedSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        PermissionRole::query()->update(['allow' => true]);
    }
}
