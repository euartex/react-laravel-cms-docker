<?php
namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\Pivot;
use App\Events\DevicePivotAttached;


class Device extends Model
{   
    use SoftDeletes;

    protected $softDelete = true;
    
    public function type(){
        return $this->belongsTo('\App\DeviceType');
    }

    public function key(){
        return $this->HasOne('\App\DeviceKey');
    }

    public function user(){
        return $this->belongsToMany('\App\User');
    }

    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'device_id',
        'duid'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
    ];

    
}
