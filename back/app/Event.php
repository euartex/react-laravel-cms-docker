<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Enums\CrudAction;

/**
 * @OA\Schema(
 *   schema="Event",
 *   allOf={
 *     @OA\Schema(
 *       @OA\Property(property="id", type="integer", description="Model id", format="int64"),
 *       @OA\Property(property="model", type="string", description="Model name"),
 *       @OA\Property(property="action", type="string", description="Model action", enum = {"Store","Save","Destroy"}),
 *       @OA\Property(property="timestamp", type="integer", format="int64", description="Datetime marker"),
 *     )
 *   }
 * )
 */
class Event extends Model
{
    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'performed_at' => 'timestamp',
    ];

    /**
     * @var string
     */
    protected $table = 'model_histories';

    /**
     * @var array
     */
    protected $hidden = ['message', 'model_type','model_id', 'user_id', 'user_type', 'meta', 'performed_at'];

    /**
     * @var array
     */
    protected $appends = ['id', 'action', 'model', 'timestamp'];

    /**
     * @param $value
     * @return mixed
     */
    public function getIdAttribute($value)
    {
        return $this->model_id;
    }

    /**
     * @param $value
     * @return mixed
     */
    public function getModelAttribute($value)
    {
        return $this->model_type;
    }

    /**
     * @param $value
     * @return mixed
     */
    public function getTimestampAttribute($value)
    {
        return $this->performed_at;
    }

    /**
     * Parse action message
     *
     * @param $value
     * @return int
     */
    public function getActionAttribute($value)
    {
        // Looking for  signs of update action from action  message
        if(Str::contains(strtolower($this->message), ['updat','attach','detach'])) return ucfirst(CrudAction::Save);

        // Looking for  signs of create action from action  message
        if(Str::contains(strtolower($this->message), ['creat','store'])) return ucfirst(CrudAction::Store);

        // Looking for  signs of delete action from action  message
        if(Str::contains(strtolower($this->message), ['delet','remov','destr'])) return ucfirst(CrudAction::Destroy);

        return $this->message;
    }
}
