<?php

namespace App\Http\Requests;

use App\Helpers\HelperController;
use App\Helpers\Rules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

class RoleRequest extends FormRequest
{
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

    public function rules()
    {
        $rules = [
            'id' => Rules::getRuleByKey('integer'),
            'permissions' => Rules::getRuleByKey('array'),
            'permissions.*.permission_id' => Rules::getRuleByKey('permission_id'),
            'permissions.*.allow' => Rules::getRuleByKey('boolean'),
            'name' => Rules::getRuleByKey('string'),

        ];

        switch($this->route()->getName()){

            case 'roles.store':
                $rules['name'][] = 'required';
                break;

            case 'roles.update':
                $rules['name'][] = 'required';
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
