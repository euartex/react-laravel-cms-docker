<?php

namespace App\Validations;

use Validator;
use App\Asset;
use App\Show;
use App\Program;

class ValidationType
{
     
    public function __construct(){



        /**
        *   This rule check a string, separated commas  and check all columns for exists there in model "Asset" or not
        *
        *   @return boolean value
        */
        Validator::extend('assetsSortColumn', function ($attribute, $value, $parameters, $validator)
        {

            foreach(explode(',', $value) as $column) if(! in_array($column, (new Asset())->getTableColumns())) return false;

            return true;
        }, 'One of columns in ":attribute"  does not exists');

        /**
        *   This rule check a string, separated commas  and check all columns for exists there in model "Show" or not
        *
        *   @return boolean value
        */
        Validator::extend('showSortColumn', function ($attribute, $value, $parameters, $validator)
        {
            foreach(explode(',', $value) as $column) if(! in_array($column, (new Show())->getTableColumns())) return false;

            return true;
        }, 'One of columns in ":attribute"  does not exists');

         /**
        *   This rule check a string, separated commas  and check all columns for exists there in model "Program" or not
        *
        *   @return boolean value
        */
        Validator::extend('programSortColumn', function ($attribute, $value, $parameters, $validator)
        {

            foreach(explode(',', $value) as $column) if(! in_array($column, (new Program())->getTableColumns())) return false;

            return true;
        }, 'One of columns in ":attribute"  does not exists');

        /**
        *   This rule check a string for boolean type
        *
        *   @return boolean value
        */
        Validator::extend('bln', function ($attribute , $value, $parameters, $validator)
        {
           return  (in_array($value, ['false', 'true', '1', '0'])) ? true : false;

        }, 'The  field ":attribute" must be boolean type, for example: true, false, 1 or 0');
    }
}
