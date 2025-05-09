<?php

namespace App\Http\Requests;

use App\Helpers\HelperController;
use App\Helpers\Rules;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class PlaylistRequest extends FormRequest
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
            'only_deleted' => Rules::getRuleByKey('boolean'),
            'is_top' => Rules::getRuleByKey('boolean'),
            'project_id' => Rules::getRuleByKey('project_id'),
            'cover' => Rules::getRuleByKey('image'),
            'poster' => Rules::getRuleByKey('image'),
            'asset_ids' => Rules::getRuleByKey('array'),
            'asset_ids.*' => Rules::getRuleByKey('asset_id'),
            'tag_ids' => Rules::getRuleByKey('array'),
            'tag_ids.*' => Rules::getRuleByKey('tagId'),
            'navigation_id' => Rules::getRuleByKey('navigation_id'),
            
        ];

        switch($this->route()->getName()){

            case 'playlist.store':
                $rules['name'][] = 'required';
                $rules['project_id'][] = 'required';
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
