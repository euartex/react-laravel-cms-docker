<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Nicolaslopezj\Searchable\SearchableTrait;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\VerifyEmail;
use App\Traits\HasRolesAndPermissions;
use Panoscape\History\HasOperations;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, Notifiable, SearchableTrait, HasRolesAndPermissions, HasOperations;

    protected $with = ['companies', 'role'];

     /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'cms_users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'email', 'password', 'phone', 'first_name','last_name', 'role_id'
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

    public function oauthAccessToken(){
        return $this->hasMany('\App\OauthAccessToken');
    }

    /**
    *   Companies (many to many)
    */
    public function companies() {
        return $this->belongsToMany('\App\Company')->without(['meta_tags']);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function role() {
        return $this->belongsTo('\App\Role');
    }

    /**
    *   Scope for listing load
    *   @param \Illuminate\Database\Eloquent\Builder $query
    *   @return \Illuminate\Database\Eloquent\Builder $query
    */
    public function scopeListSelect($query)
    {
        return $query->selectRaw('id, first_name, last_name, phone, email')->without(['role']);
    }

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
            'first_name' => 10,
            'last_name' => 10,
        ],
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
