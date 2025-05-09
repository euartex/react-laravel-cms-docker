<?php

namespace App;

use Illuminate\Database\Eloquent\Builder;
use Nicolaslopezj\Searchable\SearchableTrait;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
	use SearchableTrait;

    protected $with = ['permissions'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function permissions()
    {  
        return $this->belongsToMany(Permission::class)->withPivot('allow')->using(PermissionRole::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user() {
        return $this->hasOne('\App\User');
    }

     /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'slug'
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
            'name' => 10,
        ],
    ];

    /**
    *   Scope for listing load
    *   @param \Illuminate\Database\Eloquent\Builder $query
    *   @return \Illuminate\Database\Eloquent\Builder $query
    */
    public function scopeListSelect($query)
    {
        return $query->without(['permissions']);
    }

    /**
     * Apply the scope to a given Eloquent query builder.
     *
     * @param $query
     * @return mixed
     */
    public function scopeExcludeSuperAdminRole($query)
    {   if(config('user.superAdminId')) {
            $query->whereDoesntHave('user',  function($query) {
                $query->where('id', config('user.superAdminId'));
            });
        }

        return $query;
    }
}
