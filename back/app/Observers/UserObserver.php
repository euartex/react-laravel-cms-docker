<?php

namespace App\Observers;

use App\User;
use Symfony\Component\Finder\Exception\AccessDeniedException;

class UserObserver
{
    /**
     * Handle the user "created" event.
     *
     * @param  \App\User  $user
     * @return void
     */
    public function created(User $user)
    {
        //
    }

    /**
     * Handle the user "updating" event.
     *
     * @param  \App\User  $user
     * @throws \Exception
     * @return void
     */
    public function updating(User $user)
    {
        // Super admin doesn't have access for change own role
        if($user->getOriginal('role_id') != $user->role_id and config('user.superAdminId') == $user->id) {
            throw new AccessDeniedException('Super admin doesn\'t have access for change own role!');
        }
    }

    /**
     * Handle the user "deleted" event.
     *
     * @param  \App\User  $user
     * @return void
     */
    public function deleted(User $user)
    {
        //
    }

    /**
     * Handle the user "restored" event.
     *
     * @param  \App\User  $user
     * @return void
     */
    public function restored(User $user)
    {
        //
    }

    /**
     * Handle the user "force deleted" event.
     *
     * @param  \App\User  $user
     * @return void
     */
    public function forceDeleted(User $user)
    {
        //
    }
}
