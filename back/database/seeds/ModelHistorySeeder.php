<?php

use Illuminate\Database\Seeder;
use \Illuminate\Support\Facades\DB;
use App\Helpers\ModelHelper;

/**
 * Class ModelHistorySeeder
 */
class ModelHistorySeeder extends Seeder
{
    /**
     * @var string
     */
    private $trait = 'Panoscape\History\HasHistories';

    /**
     * @var string
     */
    private $modelHistoryTable = 'model_histories';

    /**
     * @throws Exception
     */
    public function run()
    {
        $modelsWithHasHistoriesTrait = ModelHelper::getModels()->map(function ($model){
                $modelClass = new $model;
                $usedTraits = class_uses($modelClass);

                if (in_array($this->trait, $usedTraits)) {
                    return $model;
                }

                return null;
            }
        )
        ->filter();

        foreach($modelsWithHasHistoriesTrait as $model) {
            $this->destroyModelHistotyByModel($model);
        }
    }

    /**
     * @param $model
     * @throws Exception
     */
    private function destroyModelHistotyByModel($model) {

        $modelClass = new $model;
        $modelTable = $modelClass->getTable();

        try {
            DB::table($this->modelHistoryTable)
                ->leftJoin($modelTable, $this->modelHistoryTable.'.model_id', '=', $modelTable.'.id')
                ->select($modelTable . '.id as native_model_id', $this->modelHistoryTable.'.id')
                ->where([[$modelTable . '.id', '=', null], ['model_type', '=', $model]])
                ->delete();
        } catch (Exception $exception) {
            throw new Exception($exception->getMessage());
        }
    }
}
