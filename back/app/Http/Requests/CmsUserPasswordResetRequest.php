<?php

namespace App\Http\Requests;

use App\Helpers\HelperController;
use App\Helpers\Rules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

class CmsUserPasswordResetRequest extends FormRequest
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
            'token' => Rules::getRuleByKey('reset_password_token'),
            'email' => Rules::getRuleByKey('exists_cms_user_email'),
            'new_password' => Rules::getRuleByKey('password'),
        ];

        $routeName = (string)$this->route()->getName();

        switch($routeName) {
            case 'cms.user.password.reset.create':
                $rules['email'][] = 'required';
                break;
            case 'cms.user.password.reset.reset':
                $rules['token'][] = 'required';
                $rules['new_password'][] = 'required';
                break;
            default:break;
        }

        return $rules;
    }


    public function failedValidation(Validator $validator)
    {
        HelperController::failedRequestValidator($validator);
    }
}
