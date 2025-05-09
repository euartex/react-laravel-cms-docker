<?php

namespace App\Traits;
use Panoscape\History\Events\ModelChanged;
use Fico7489\Laravel\Pivot\Traits\PivotEventTrait;
use Illuminate\Support\Collection;
use App;

trait HasPivotForHistory
{	
	use  PivotEventTrait;


    public static function bootHasPivotForHistory()
	{ 	
		return App::runningInConsole() ?? static::init();
	}


	private static function init(){
 
		if(method_exists(static::class, 'pivotAttached')){ 
		    
		    static::pivotAttached(function ($model, $relationName, $pivotIds, $pivotIdsAttributes){   
		       
		    	if($data = static::getData($model, $relationName, $pivotIds, $pivotIdsAttributes))   return event(new ModelChanged($model, ucfirst($data['key']).' has been attached', [['key' => $data['key'], 'old' => $data['old'], 'new' => $data['new']]]));

		    }); 
		}

		if(method_exists(static::class, 'pivotDetached')){ 
		    
		    static::pivotDetached(function ($model, $relationName, $pivotIds, $pivotIdsAttributes)  {    
		   
		   		if($data = static::getData($model, $relationName, $pivotIds, $pivotIdsAttributes)) return event(new ModelChanged($model, ucfirst($data['key']).' has been detached', [['key' => $data['key'], 'old' => $data['old'], 'new' => $data['new']]]));	
			});
		}
	
	    if(method_exists(static::class, 'pivotUpdated')){ 
		    
		    static::pivotUpdated(function ($model, $relationName, $pivotIds, $pivotIdsAttributes)  {    
		        
		        if($data = static::getData($model, $relationName, $pivotIds, $pivotIdsAttributes)) return event(new ModelChanged($model, ucfirst($data['key']).' has been updated', [['key' => $data['key'], 'old' => $data['old'], 'new' => $data['new']]]));
		    });
		}
	}


	private static function getData($model, $relationName, $pivotIds = null, $pivotIdsAttributes = null){

		if($pivotIds){

			$data = new Collection(['key' => null, 'old' => null, 'new' => null]);

			if($model->$relationName){

				$old = $model->$relationName->map(function ($item) use ($pivotIds){
							    
					if($item) return ($item->title ?? $item->name) ?? $item->original . "\r\n";  
				});
		 		
		 		if($pivotIds){

					$new = collect($pivotIds)->map(function ($pivotId) use ($model, $relationName){

						if($item = $model->$relationName()->find($pivotId))   return ($item->title ?? $item->name) ?? $item->original . "\r\n"; 
					});
				}

				if($old = $old->whereNotNull()->all()) $data['old'] = $old;

				if($new = $new->whereNotNull()->all()) $data['new'] = $new;

				$data['key'] = $relationName;
			}

			return $data;
		}

		return null;
	}
}