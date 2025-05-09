<?php

namespace App;

use \Illuminate\Database\Eloquent\Relations\Pivot;

class PermissionRole extends Pivot {

	/**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'role_id', 'permission_id',
    ];

    /**
     * @var array
     */
    protected $fillable = [
        'allow',
        'permission_id',
        'role_id'
    ];

    /**
     * @var bool
     */
    public $timestamps = false;
}
