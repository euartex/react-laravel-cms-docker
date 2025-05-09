<?php

namespace App\Relations;

use Rutorika\Sortable\BelongsToSortedMany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Fico7489\Laravel\Pivot\Traits\FiresPivotEventsTrait;


class BelongsToSortedManyCustom extends BelongsToSortedMany
{   
    use FiresPivotEventsTrait;

    /**
     * Create a new belongs to many relationship instance.
     * Sets default ordering by $orderColumn column.
     *
     * @param Builder $query
     * @param Model   $parent
     * @param string  $table
     * @param string  $foreignPivotKey
     * @param string  $relatedPivotKey
     * @param string  $parentKey
     * @param string  $relatedKey
     * @param string  $relationName
     * @param string  $orderColumn     position column name
     */
    public function __construct(Builder $query, Model $parent, $table, $foreignPivotKey, $relatedPivotKey, $parentKey, $relatedKey, $relationName = null, $orderColumn = null)
    {
        parent::__construct($query, $parent, $table, $foreignPivotKey, $relatedPivotKey, $parentKey, $relatedKey, $relationName, $orderColumn);
        
        $this->relationName = $table;
        
        $this->setOrderColumn($orderColumn);
    }
}