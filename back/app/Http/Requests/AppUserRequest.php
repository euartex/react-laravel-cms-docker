<?php

namespace App\Http\Requests;

use App\Helpers\HelperController;
use App\Helpers\Rules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

class AppUserRequest extends FormRequest
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
            'email' => Rules::getRuleByKey('unique_app_user_email'),
            'password' => Rules::getRuleByKey('password'),
            'last_name' => Rules::getRuleByKey('last_name'),
            'first_name' => Rules::getRuleByKey('first_name'),
            'limit' => Rules::getRuleByKey('integer'),
            'page' => Rules::getRuleByKey('integer'),
            'newsletter' => Rules::getRuleByKey('boolean'),
        ];

        switch($this->route()->getName()){

            case 'app.user.store':
                $rules['email'][] = 'required';
                $rules['password'][] = 'required';
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
