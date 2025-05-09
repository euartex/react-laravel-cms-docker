<?php

namespace App\Helpers;

use App\Asset;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;

class VDMSHelper
{
    public static function actualizeVDMSAvailability(Collection $collection, Array $response)
    {
        //Log::info(print_r($response, true));

        //If response error
        if($response['error'] === 1)
        {
            return false;
        }

        foreach ($collection as $asset) {
            //Find vdms_id in response
            $key = array_search($asset->vdms_id, array_column($response['assets'], 'id'));

            //If find, remove from collection
            if (is_int($key))
                $collection = self::forgetById($collection,$asset->id);
        }

        self::setIsDeletedVdms($collection);

    }


    public static function setIsDeletedVdms(Collection $collection)
    {
        $assets = Asset::whereIsVdmsDeleted(false)->whereIn('id', $collection->pluck('id')->toArray())->update(['is_vdms_deleted' => true]);
    }

    public static function forgetById($collection, $id)
    {
        foreach ($collection as $key => $item) {
            if ($item->id == $id) {
                $collection->forget($key);
                break;
            }
        }
        return $collection;
    }
}
