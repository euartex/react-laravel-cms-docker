<?php

namespace App\Http\Requests;

use App\Helpers\HelperController;
use App\Helpers\Rules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

class AuthRequest extends FormRequest
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
            'email' => Rules::getRuleByKey('exists_cms_user_email'),
            'refresh_token' => Rules::getRuleByKey('refresh_token'),
            'password' => Rules::getRuleByKey('password'),
        ];

        switch($this->route()->getName()) {
            case 'auth.token.refresh':
                $rules['refresh_token'][] = 'required';
            break;
            
            case 'auth.login':
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
