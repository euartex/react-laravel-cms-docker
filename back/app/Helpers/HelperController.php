<?php

namespace App\Helpers;

use App\Asset;
use App\Enums\StatusCode;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\File;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Image;

class HelperController
{
    public static function getPagination($pagination)
    {
        return [
            'url' => [
                'next' => $pagination['next_page_url'],
                'previous' => $pagination['prev_page_url'],
                'last' => $pagination['last_page_url'],
                'first' => $pagination['first_page_url']
            ],
            'limit' => (int)$pagination['per_page'],
            'total' => (int)$pagination['total']
        ];
    }

    public static function getQueryCacheKey(Request $request)
    {
        $url = $request->url();
        $queryParams = $request->query();

        //Sorting query params by key (acts by reference)
        ksort($queryParams);

        //Transforming the query array to query string
        $queryString = http_build_query($queryParams);

        $cache_key = "{$url}?{$queryString}";

        return $cache_key;
    }

    public static function failedRequestValidator(Validator $validator)
    {
        $validationErrors = (new ValidationException($validator))->errors();

        throw new HttpResponseException(response()->json([
                'message' => 'Validation error',
                'validationErrors' => $validationErrors,
            ]
            , StatusCode::BAD_REQUEST));
    }

    public static function sortCollection(\Illuminate\Support\Collection $collection, $field, $direction)
    {
        if ($direction == 'DESC')
            $sorted = $collection->sortByDesc($field);
        else if ($direction == 'ASC')
            $sorted = $collection->sortBy($field);

        return $sorted->values();
    }

    /**
     * Generates random image; temporary fix for current issue.
     *
     * @param string $absolutePath
     * @param int $width
     * @param int $height
     * @return bool
     */
    public static function saveRandomImage(string $absolutePath, $width = 640, $height = 480)
    {
        // Create a blank image:
        $im = imagecreatetruecolor($width, $height);
        // Add light background color:
        $bgColor = imagecolorallocate($im, rand(100, 255), rand(100, 255), rand(100, 255));
        imagefill($im, 0, 0, $bgColor);

        // Save the image:
        $isGenerated = imagejpeg($im, $absolutePath);

        // Free up memory:
        imagedestroy($im);

        return $isGenerated;
    }

    /**
     * Resize image
     *
     * @param string $absolutePath
     * @param int $width
     * @param int $height
     * @param string $url
     * @return bool
     */
    public static function saveImage(string $absolutePath, $width = 640, $height = 480, $url)
    {

        $image = Image::make($url);

        // resize image instance
        $image->resize($width, $height);

        $resource = $image->stream()->detach();

        $storagePath = Storage::disk('s3')->put(
            $absolutePath,
            $resource,'public'
        );

        return Storage::disk('s3')->url($storagePath);
    }



    /**
     *   Generate next integer number by (next(), current()) used in factorys
     */
    public static function autoIncrement()
    {
        for ($i = 0; $i < PHP_INT_MAX; $i++) {
            yield $i;
        }
    }


    /**
     *  Now is not used
     */
    public static function getDeviceTypeSlugFromRequest()
    {
        if(request('device_type_slug'))
            return request('device_type_slug');

        return 'web';
    }

    /**
    *   Get short class name from object
    *   @param $object instance of object
    *   @return short class name string
    */
    public static function getClassNameFromObject(Object $object){
        return mb_strtolower ((new \ReflectionClass($object))->getShortName());
    }


    /**
     * Remove all relationships from query builder if request has param
     * @param Request $request
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */

    public static function getEloquentBuilderWithoutRelationshipsByRequest(Request $request, \Illuminate\Database\Eloquent\Builder $query)
    {
        if($request->filled('without_relations') AND $request->get('without_relations') == true)
           return $query->setEagerLoads([]);

        return $query;
    }
}