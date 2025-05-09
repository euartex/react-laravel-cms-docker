<?php

namespace App\Http\Requests;

use App\Helpers\HelperController;
use App\Helpers\Rules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

class TagRequest extends FormRequest
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
            'id' => Rules::getRuleByKey('tagId'),
            'is_top_news_tag' => Rules::getRuleByKey('boolean'),
            'metadata_ids' => Rules::getRuleByKey('array'),
            'metadata_ids.*' => Rules::getRuleByKey('metadataId'),
            'title' => Rules::getRuleByKey('string'),
            'is_asset_pl_add_sort_by_id' => Rules::getRuleByKey('boolean')

        ];

        switch($this->route()->getName()){

            case 'tag.store':
              $rules['title'][] = 'required';
            break;

            case 'tag.update':
              $rules['title'][] = 'required';
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
