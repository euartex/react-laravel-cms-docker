<?php

namespace App\Http\Requests;

use App\Helpers\HelperController;
use App\Helpers\Rules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

class RevisionRequest extends FormRequest
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
          'limit' => Rules::getRuleByKey('integer'),
          'page' => Rules::getRuleByKey('integer'),
          'id' => Rules::getRuleByKey('integer'),
          'model_type' => Rules::getRuleByKey('model_type'),
        ];

        switch((string)$this->route()->getName()) {
          case 'revision.show':
            $rules['model_type'][] = 'required';
            $rules['id'][] = 'required';
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
