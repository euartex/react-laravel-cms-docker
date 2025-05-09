<?php

namespace App\Http\Requests;

use App\Helpers\HelperController;
use App\Helpers\Rules;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class ProgramRequest extends FormRequest
{
    /**
     * Use path parameters for validation
     * @return array
     */

    protected $routeParametersToValidate = ['id' => 'id'];

    public function all($keys = null)
    {
        $data = parent::all();

        foreach ($this->routeParametersToValidate as $validationDataKey => $routeParameter) {
            $data[$validationDataKey] = $this->route($routeParameter);
        }

        return $data;
    }

    /**
     * Use route parameters for validation
     * @return array
     */
    public function validationData()
    {
        return array_merge($this->all(), $this->route()->parameters());
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules = [
            'limit' => Rules::getRuleByKey('integer'),
            'page' => Rules::getRuleByKey('integer'),
            'poster' => Rules::getRuleByKey('image'),
            'name' => Rules::getRuleByKey('program_name'),
            'project_id' => Rules::getRuleByKey('project_id'),
            'show_id' => Rules::getRuleByKey('show_id'),
            'start_show_at' => Rules::getRuleByKey('program_start_at'),
            'end_show_at' => Rules::getRuleByKey('program_end_at'),
            'type' => Rules::getRuleByKey('program_type'),
            'sortDesc' => Rules::getRuleByKey('sortDesc'),
            'sort' => Rules::getRuleByKey('sort'),
        ];
        
        $rules['sortDesc'][] = 'programSortColumn';
        $rules['sort'][] = 'programSortColumn';

        switch($this->route()->getName()){

            case 'program.store':
                $rules['name'][] = 'required';
                $rules['project_id'][] = 'required';
                $rules['show_id'][] = 'required';
                $rules['start_show_at'][] = 'required';
                $rules['end_show_at'][] = 'required';
                $rules['type'][] = 'required';
                break;

            case 'program.update':
                $rules['start_show_at'][] = 'required_with:end_show_at';
                $rules['end_show_at'][] = 'required_with:start_show_at';
                break;
            default:break;



        }

        return $rules;
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function failedValidation(Validator $validator)
    {
        HelperController::failedRequestValidator($validator);
    }
}
