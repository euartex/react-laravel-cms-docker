<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CallbackEndpoint extends Model
{
    use SoftDeletes;

    /**
     * @var string
     */
    protected $table = 'callback_endpoints';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'url',
    ];
}
