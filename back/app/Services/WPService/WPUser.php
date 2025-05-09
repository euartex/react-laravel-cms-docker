<?php

namespace App\Services\WPService;

use App\AppUser;
use App\User;
use Illuminate\Http\Exceptions\HttpResponseException;


/**
 * Class WPUser
 * @package App\Services\WPService
 */
class WPUser
{
    /**
     * @var WPService
     */
    protected $WPService;

    /**
     * Entity
     * @var string
     */
    protected $entity;

    /**
     * Fillable columns in WP
     * @var array
     */
    protected $fillable;

    /**
     * The user to whom deleted posts will be attached in WP
     * @var integer
     */

    protected $userId;

    /**
     * WPUser constructor.
     * @param WPService $WPService
     */
    public function __construct(WPService $WPService)
    {
        $this->WPService = $WPService;
        $this->entity = 'users';
        $this->userId = config('wp.userId');
        $this->fillable = ['first_name', 'last_name', 'email'];
    }

    /**
     * Create new user in WP
     * @param AppUser $user
     * @param $password (not hashed)
     * @return bool
     *
     */

    public function create(AppUser $user, $password)
    {

        /**
         * Merge fillable vars and additional params
         */
        $formData = array_merge(array_intersect_key($user->getAttributes(), array_flip($this->fillable)),
            ['password' => $password, 'username' => $user->email]
        );

        $response = $this->WPService->sendRequest('/' . $this->entity, 'post', $formData);

        /**
         * If the user wasn't created in WP
         */
        if ($response instanceof HttpResponseException) {
            /**
             * Delete from our system
             */
            $user->forceDelete();
            throw $response;
        }

        /**
         * Save user id from WP to db
         */

        $user->external_id = $response['id'];
        $user->save();
        return true;
    }


    /**
     * Update user in WP
     * @param AppUser $user
     * @param $data
     * @return bool
     */

    public function update(AppUser $user, $data)
    {
        if ($user->getAttribute('external_id')) {

            /**
             * Filter Fillable vars
             */
            $queryData = array_merge(array_intersect_key($data, array_flip($this->fillable)),
                ['password' => isset($data['newpassword']) ? $data['newpassword'] : null]
            );

            $response = $this->WPService->sendRequest('/' . $this->entity . '/' . $user->external_id, 'put', null, $queryData);

            $this->WPService->__getResponse($response);
        }
    }

    /**
     * Delete user from WP
     * @param AppUser $user
     * @return bool
     */

    public function delete(AppUser $user)
    {
        if ($user->getAttribute('external_id')) {

            $response = $this->WPService->sendRequest('/' . $this->entity . '/' . $user->external_id . '?reassign='.$this->userId.'&force=true', 'delete');

            $this->WPService->__getResponse($response);
        }
    }
}
