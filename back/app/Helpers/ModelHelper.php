<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Model;
use HaydenPierce\ClassFinder\ClassFinder;

class ModelHelper
{
    /**
     * @return \Illuminate\Support\Collection
     * @throws \Exception
     */
    static function getModels(){
        return collect(ClassFinder::getClassesInNamespace('App'))
            ->filter(function($className){
                return is_subclass_of($className, Model::class);
            });
    }
}