<?php

namespace App\Http\Requests;

use App\Helpers\HelperController;
use App\Helpers\Rules;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class StaticPageRequest extends FormRequest
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
            'title' => Rules::getRuleByKey('static_page_title'),
            'sub_title' => Rules::getRuleByKey('static_page_title'),
            'project_id' => Rules::getRuleByKey('project_id'),
            'html_content' => Rules::getRuleByKey('static_page_html'),
            'limit' => Rules::getRuleByKey('integer'),
            'page' => Rules::getRuleByKey('integer'),
            'id' => Rules::getRuleByKey('integer'),
            'order' => Rules::getRuleByKey('static_page_order'),
            'type' => Rules::getRuleByKey('static_page_type'),
        ];

        switch($this->route()->getName()){

            case 'static.page.store':
                $rules['title'][] = 'required';
                $rules['project_id'][] = 'required';
                $rules['type'][] = 'required';
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
