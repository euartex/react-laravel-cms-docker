<?php

namespace App\Traits;
use App\Enums\AssetType;
use Panoscape\History\Events\ModelChanged;
use Fico7489\Laravel\Pivot\Traits\PivotEventTrait;
use App\Helpers\HelperController;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Cache\TaggableStore;

trait HasCache
{	
	use  PivotEventTrait;


	private static function cacheClear(Model $model)
	{	

		if(Cache::getStore() instanceof TaggableStore) {

			$tags = [];

			//Get model name
			$model_name = HelperController::getClassNameFromObject($model);

			//Model clear cache by tag name for specific item
			if(isset($model->slug)) $tags[] = $model_name . $model->slug; //If slug exists
			if(isset($model->id))   $tags[] = $model_name . $model->id; //If id exists

            // Clear  cache by model type
            if ($model->type ?? null) {
                switch($model->type) {
                    case AssetType::Livefeed:
                        $tags[] = AssetType::Livefeed;
                        break;
//                    case AssetType::Article:
//                        $tags[] = AssetType::Article;
//                        break;
//                    case AssetType::Video:
//                        $tags[] = AssetType::Video;
//                        break;
                    default:
                        $tags[] = $model_name;
                        break;
                }
            }

			$custom_id = $model_name . '_id';
			if(isset($model->$custom_id))   $tags[] = $model_name . $model->$custom_id; //If custom id exists (like: playlist_id)
 
			return Cache::tags($tags)->flush() ?? false;
 
		}

		return false;
	}
    

    public static function bootHasCache()
	{
		static::created(function($model)   {
			self::cacheClear($model);
		});

		static::updated(function($model)  {  
			self::cacheClear($model);
		});

		static::saved(function($model)  {
			self::cacheClear($model);
		});

		static::deleted(function($model)  {  
			self::cacheClear($model);
		});

		if(method_exists(static::class, 'restored')){
			static::restored(function($model)  {
				self::cacheClear($model);
			});
		}
	    
	    static::pivotAttached(function ($model, $relationName, $pivotIds, $pivotIdsAttributes) {
	        self::cacheClear($model);
	    });

	    static::pivotDetached(function ($model, $relationName, $pivotIds) {
	    	self::cacheClear($model);
	    });

	    static::pivotUpdated(function ($model, $relationName, $pivotIds, $pivotIdsAttributes)  {
			self::cacheClear($model);
	    });
 
	}
}