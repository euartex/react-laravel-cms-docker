<?php

namespace App\Http\Requests;

use App\Helpers\HelperController;
use App\Helpers\Rules;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class BannerRequest extends FormRequest
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
            'timeout' => Rules::getRuleByKey('integer'),
            'limit' => Rules::getRuleByKey('integer'),
            'page' => Rules::getRuleByKey('integer'),
            'image' => Rules::getRuleByKey('image'),
            'name' => Rules::getRuleByKey('string'),
            'ids' => Rules::getRuleByKey('array'),
            'ids.*' => Rules::getRuleByKey('banner_id'),
            'project_id' => Rules::getRuleByKey('project_id'),
        ];

        switch((string)$this->route()->getName()) {
            case 'banner.destroy':
                $rules['ids'][] = 'required';
            break;

            case 'banner.restore':
                $rules['ids'][] = 'required';
            break;

            case 'banner.show':
                $rules['id'][] = 'required';
            break;

            case 'banner.update':
                $rules['id'][] = 'required';
            break;

            case 'banner.store':
                $rules['name'][] = 'required';
                $rules['project_id'][] = 'required';
                $rules['timeout'][] = 'required';
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
