<?php

namespace App\Http\Requests;

use App\Helpers\HelperController;
use App\Helpers\Rules;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class LivefeedRequest extends FormRequest
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
            'only_deleted' => Rules::getRuleByKey('boolean'),
            'limit' => Rules::getRuleByKey('integer'),
            'page' => Rules::getRuleByKey('integer'),
            'id' => Rules::getRuleByKey('livefeed_id'),
            'logo' => Rules::getRuleByKey('image'),
            'name' => Rules::getRuleByKey('string'),
            'url' => Rules::getRuleByKey('url'),
            'ids' => Rules::getRuleByKey('array'),
            'ids.*' => Rules::getRuleByKey('livefeed_id'),
            'description' => Rules::getRuleByKey('string'),
            'livefeed_id' => Rules::getRuleByKey('livefeed_hash_id'),
            'tag_ids' => Rules::getRuleByKey('array'),
            'tag_ids.*' => Rules::getRuleByKey('tagId'),
            'company_id' => Rules::getRuleByKey('company_id'),
            'project_id' => Rules::getRuleByKey('project_id'),
        ];

        switch((string)$this->route()->getName()) {
            case 'livefeed.destroy':
                $rules['ids'][] = 'required';
            break;

            case 'livefeed.show':
                $rules['id'][] = 'required';
            break;

            case 'livefeed.update':
                $rules['id'][] = 'required';
            break;

            case 'livefeed.store':
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
