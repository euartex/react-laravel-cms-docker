<?php

namespace App\Traits;

use App\Events\CallBackEntityChanged;
use Illuminate\Database\Eloquent\Model;
use App\Enums\CrudAction;
use Fico7489\Laravel\Pivot\Traits\PivotEventTrait;
use App\Callback;

/**
 * Trait CallbackCacheTrait
 * @package App\Traits
 */
trait CallbackCacheTrait
{

    use PivotEventTrait;


    public static function bootCallbackCacheTrait()
    {
        static::saved(function (Model $model) {
            if ($model->wasRecentlyCreated) {
                static::listenChange($model, CrudAction::Store);
            } else {
                if (!$model->getChanges()) {
                    return;
                }

                //Filter updated_at event
                if (array_key_exists('updated_at', $model->getChanges()) && count($model->getChanges()) === 1) {
                    return;
                }

                static::listenChange($model, CrudAction::Save);
            }
        });

        static::deleted(function (Model $model) {
            static::listenChange($model, CrudAction::Destroy);
        });

        /*
         * Detecting pivot update
         */
        static::pivotAttached(function ($model, $relationName, $pivotIds, $pivotIdsAttributes) {
            static::listenChange($model, CrudAction::Save);
        });

        static::pivotDetached(function ($model, $relationName, $pivotIds, $pivotIdsAttributes) {
            static::listenChange($model, CrudAction::Save);
        });

        static::pivotUpdated(function ($model, $relationName, $pivotIds, $pivotIdsAttributes) {
            static::listenChange($model, CrudAction::Save);
        });

    }

    /**
     * @param Model $model
     * @param $action
     */
    public static function listenChange(Model $model, $action)
    {
        /**
         * New callback dispatch to event
         */
        $callback = new Callback();
        $callback->setId($model->getAttributeValue('id'));
        $callback->setType(get_class($model));
        $callback->setAction($action);

        event(new CallBackEntityChanged($callback));
    }
}
