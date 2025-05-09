<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DeviceKey extends Model
{
	
	public function device(){
        return $this->belongsTo('\App\Device');
    }

	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'key',
        'device_id',
    ];

	/**
     * The key generation
     *
     * @return integer(4)
     */
    public function keyGenerator() {
        
        do{
            $key = rand(1000,9999);
        } while($this->keyExists($key));

        return $key;
    }

    /**
     * The key exists checker
     *
     * @return boolean
     */
    public function keyExists($key) {
        return $this->whereKey($key)->exists();
    }
}
