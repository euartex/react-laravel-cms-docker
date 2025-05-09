<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Nicolaslopezj\Searchable\SearchableTrait;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\VerifyEmail;


class AppUser extends Authenticatable implements MustVerifyEmail
{
    use  SearchableTrait, Notifiable;

    protected $with = ['device'];

     /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'email',
        'password',
        'last_name',
        'first_name',
        'newsletter',
        'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password'
    ];

    /**
     * Searchable rules.
     *
     * @var array
     */
    protected $searchable = [
        /**
         * Columns and their priority in search results.
         * Columns with higher values are more important.
         * Columns with equal values have equal importance.
         *
         * @var array
         */
        'columns' => [
            'email' => 10,
            'first_name' => 5,
            'last_name' => 5,
        ],
    ];


     /**
    *   Scope for listing load
    *   @param \Illuminate\Database\Eloquent\Builder $query
    *   @return \Illuminate\Database\Eloquent\Builder $query
    */
    public function scopeListSelect($query)
    {
        return $query->selectRaw('id, first_name, last_name, email')->without(['device']);
    }


    /**
     * Send the email verification notification.
     *
     * @return void
     */
    public function sendEmailVerificationNotification()
    {
        try{

            $this->notify(new VerifyEmail);
        }catch(\Exception $e){

            \Log::warning('The verification email has not been sent!');
            \Log::debug($e->getMessage());
        }
    }


    public function device(){
        return $this->belongsToMany('\App\Device','device_user', 'device_id', 'user_id')->with(['type','key']);
    }

    public function ratedAssets() {
        return $this->belongsToMany('\App\Asset','asset_ratings')
            ->withPivot('rating_value', 'rating_value')
            ->withTimestamps();
    }

}
