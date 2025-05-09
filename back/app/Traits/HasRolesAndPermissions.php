<?php

namespace App\Traits;

use App\Role;
use App\PermissionRole;

trait HasRolesAndPermissions
{
    /**
     * @return mixed
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * @return mixed
     */
    public function permissionRole()
    {
        return $this->hasManyThrough(PermissionRole::class, Role::class, 'id', 'role_id', 'role_id','id');
    }
  
    /**
     * @param array  $permission
     * @return bool
     */
    public function hasPermission(array $permission ) {

        $action_is_allowed = $this->permissionRole->contains(function($model) {
                return  $model->allow;
            }
        );

        $route_is_allowed = $this->role->permissions->contains('slug', $permission['route']);
 
        return ($route_is_allowed and  $action_is_allowed) ? true : false;
    }
}