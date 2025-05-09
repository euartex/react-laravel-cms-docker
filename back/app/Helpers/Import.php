<?php

namespace App\Helpers;

use App\Enums\ProgramType;
use App\Enums\StatusCode;
use Illuminate\Support\Str;
use BenSampo\Enum\Rules\Enum;
use App\Playlist;
use App\Program;
use App\Show;
use Whoops\Exception\ErrorException;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Request;
use Exception;
use PHPUnit\Framework\Error\Error;
use SebastianBergmann\ObjectEnumerator\InvalidArgumentException;

class Import
{

    public static function parseTimeSheet(array $sheetAsArray) {

        $header = reset($sheetAsArray);
        unset ($sheetAsArray[0]);

        for($i=3; $i <= count($header); $i = $i +2) {

            $dateTypeArray[Carbon::parse($header[$i-1]['value'])->format('Y-m-d')] = array (
                'date' => array(
                    'date' => Carbon::parse($header[$i-1]['value'])->format('Y-m-d'),
                    'name' => $header[$i-1]['name']),
                'type' => array('type' => $header[$i]['value'], 'name' =>  $header[$i-1]['name']),
                'leftKey' =>  preg_replace('/[^a-zA-Z]/', '', $header[$i-1]['name']),
                'rightKey' => preg_replace('/[^a-zA-Z]/', '', $header[$i]['name'])
            );
        }

        $dateTypeArray[Carbon::parse($header[count($header) - 2]['value'])->addDay(1)->format('Y-m-d')] = array(
            'leftKey' => $header[count($header) - 2]['name'],
            'rightKey' => $header[count($header) - 1]['name']
        );

        $list = array();

        foreach($dateTypeArray as $day => $element) {

            $index = null;
            $keyPreviousElem = null;

            foreach($sheetAsArray as $rowNumber => $row) {

                $time =  Carbon::parse($row[0]['value'])->format('H:i') ;

                foreach($row as $column) {

                    $name = preg_replace('/[^a-zA-Z]/', '', $column['name']);
                    $value = $column['value'];

                    if($element['leftKey'] === $name) {  //found show
                        if($value !== '') {

                            if($index ) {

                                if( Carbon::parse($list[$index]['startShow'])->gt( Carbon::parse($day. ' '. $time)) ) {

                                    $list[$index]['endShow']  = Carbon::parse($day)->addDay(1)->format('Y-m-d'). ' '. $time;
                                    $dateTypeArray[$day]['list'] = $list;

                                    $day = Carbon::parse($day)->addDay(1)->format('Y-m-d');
                                    $keyPreviousElem = null;
                                    $index = null;
                                    $list = array();
                                }
                            }

                            $keyLastElement = array_key_last($list);

                            if(isset($list[$keyLastElement]['endShow']) && is_null($list[$keyLastElement]['endShow'])) {

                                $list[$keyLastElement]['endShow'] = $day. ' '. $time;
                            }

                            $list[$rowNumber] = array(
                                'showName' => $value,
                                'startShow' => $day. ' '. $time,
                                'endShow' => null,
                                'i' => $index
                            );

                            $index = $rowNumber;
                            $keyPreviousElem = $list[$rowNumber]['i'];

                            if(
                                !is_null($keyPreviousElem) && count($list) >= 1
                            ) {
                                $list[$keyPreviousElem]['endShow'] = $day. ' '. $time;
                            }
                        }
                    }

                    if($element['rightKey'] === $name) {  //found type in the cell
                        if($value !== '') {
                            $list[$rowNumber]['showType'] = $value;
                        }
                    }
                }
            }

            if( !$list[array_key_last($list)]['endShow']) {
                $list[array_key_last($list)]['endShow'] = $day. ' '. '06:00';
            }

            $dateTypeArray[$day]['list'] = $list;
        }

        return $dateTypeArray;
    }


    public static function parseDescriptionSheet(array $sheetAsArray ) {

        unset ($sheetAsArray[0]) ;
        $showsDescription = array();

        foreach($sheetAsArray as $rowNumber => $row) {

            $showsDescription[] = array('title' => isset($row[0]) ? $row[0]['value'] : '', 'description' => isset($row[1]) ? $row[1]['value'] : '');
        }

        return $showsDescription;
    }

    public static function createShow($data)
    {
        $playlist = Playlist::whereName($data['title'])->first();

        $validatorData = [
            'title' => $data['title'],
            'description' => $data['description'],
            'playlist_id' =>  $playlist ? $playlist->id : null
        ];

        $validator = Validator::make($validatorData, [
            'title' => 'required',
            'description' => 'required',
            'playlist_id' => Rules::getRuleByKey('playlist_id')
        ]);

        if ($validator->fails()) {
            HelperController::failedRequestValidator($validator);
        }

        $show = Show::create($validatorData);

        $show->save();
    }

    public static function createProgram($data)
    {
        //Todo refactoring compare string
        $show = Show::where('title','like', '%' .$data['showName'] . '%')->first();
        //$show = Show::whereTitle(preg_replace('/[^\da-z]/i', '', $data['showName']))->first();

        $validatorData = [
            'name' => preg_replace('!\s+!', ' ', $data['showName']),
            'start_show_at' => $data['startShow'],
            'end_show_at' => $data['endShow'],
            'type' =>  ProgramType::fromKey(str_replace(' ','_',$data['showType'])),
            'project_id' => 1,
            'show_id' => $show ? $show->id : null
        ];

        $validator = Validator::make($validatorData, [
            'name' => 'required',
            'start_show_at' => Rules::getRuleByKey('program_start_at'),
            'end_show_at' => Rules::getRuleByKey('program_end_at_not_request'),
            'type' => ['required', new Enum(ProgramType::class)],
            'project_id' => Rules::getRuleByKey('project_id'),
            'show_id' => Rules::getRuleByKey('show_id')
        ]);

        if ($validator->fails()) {
            HelperController::failedRequestValidator($validator);
        }

        $program = Program::create($validatorData);

    }
}
