<?php

namespace App\Http\Requests;

use App\Helpers\HelperController;
use App\Helpers\Rules;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class NavigationRequest extends FormRequest
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
            'title' => Rules::getRuleByKey('navigation_string'),
            'cms_title' => Rules::getRuleByKey('navigation_string'),
            'description' => Rules::getRuleByKey('navigation_string'),
            'seo_title' => Rules::getRuleByKey('navigation_string'),
            'seo_description' => Rules::getRuleByKey('navigation_string'),
            'type_id' => Rules::getRuleByKey('navigation_type_id'),
            'project_id' => Rules::getRuleByKey('project_id'),
            'only_deleted' => Rules::getRuleByKey('boolean'),
            'playlist_arr' => Rules::getRuleByKey('array'),
            'playlist_arr.*' => Rules::getRuleByKey('playlist_id'),
        ];

        switch($this->route()->getName()){

            case 'navigation.store':
                $rules['title'][] = 'required';
                $rules['project_id'][] = 'required';
                $rules['type_id'][] = 'required';
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
