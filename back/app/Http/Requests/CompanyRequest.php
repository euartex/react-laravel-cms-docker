<?php

namespace App\Http\Requests;

use App\Helpers\HelperController;
use App\Helpers\Rules;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class CompanyRequest extends FormRequest
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
            'name' =>  Rules::getRuleByKey('company_string'),
            'address' =>  Rules::getRuleByKey('company_string'),
            'country' =>  Rules::getRuleByKey('company_string'),
            'phone' =>  Rules::getRuleByKey('company_string'),           
            //'tax_number' =>  Rules::getRuleByKey('company_string'),
            'auto_published' =>  Rules::getRuleByKey('boolean'),
            'email' => Rules::getRuleByKey('email'),
            'tag_ids' => Rules::getRuleByKey('array'),
            'tag_ids.*' => Rules::getRuleByKey('tagId'),
            'has_toplist' =>  Rules::getRuleByKey('boolean'),
            'without_relations' =>  Rules::getRuleByKey('boolean'),
        ];

        switch($this->route()->getName()){

            case 'company.store':
                $rules['name'][] = 'required';
                $rules['email'][] = 'required';
                $rules['email'][] = 'unique:companies,email';
                break;
            case 'static.page.order':
                $rules['order'][] = 'required';
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
