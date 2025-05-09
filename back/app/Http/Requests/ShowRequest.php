<?php

namespace App\Http\Requests;

use App\Helpers\HelperController;
use App\Helpers\Rules;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class ShowRequest extends FormRequest
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
            'id' => Rules::getRuleByKey('integer'),
            'title' =>  Rules::getRuleByKey('show_title'),
            'description' =>  Rules::getRuleByKey('show_description'),
            'sortDesc' => Rules::getRuleByKey('sortDesc'),
            'sort' => Rules::getRuleByKey('sort'),
            'playlist_id' => Rules::getRuleByKey('playlist_id'),
            'cover' => Rules::getRuleByKey('image'),
            'poster' => Rules::getRuleByKey('image'),
        ];

        $rules['sortDesc'][] = 'showSortColumn';
        $rules['sort'][] = 'showSortColumn';


        switch($this->route()->getName()){

            case 'show.store':
                $rules['title'][] = 'required';
                $rules['description'][] = 'required';
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
