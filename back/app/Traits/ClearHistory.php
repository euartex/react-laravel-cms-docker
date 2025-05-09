<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;
use App\Jobs\DeleteItemsHistory;


/**
 * Trait CallbackCacheTrait
 * @package App\Traits
 */
trait ClearHistory
{
    /**
     * Load trait
     */
    public static function bootClearHistory()
    {
        /**
         * Listen delete
         */
        static::deleted(function (Model $model) {
            static::deleteItemsHistory($model);
        });

    }

    /**
     * @param Model $model
     */

    public static function deleteItemsHistory(Model $model)
    {
        dispatch(new DeleteItemsHistory(get_class($model), $model->getAttributeValue('id')));
    }
}
