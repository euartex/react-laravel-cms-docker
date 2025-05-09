<?php

namespace App\Http\Requests;

use App\Helpers\HelperController;
use App\Helpers\Rules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

class AssetRequest extends FormRequest
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
            'cover' => Rules::getRuleByKey('image'),
            'poster' => Rules::getRuleByKey('image'),
            'sort' => Rules::getRuleByKey('sort'),
            'is_main' => Rules::getRuleByKey('boolean'),
            'q' => Rules::getRuleByKey('q'),
            'company_id' => Rules::getRuleByKey('company_id'),
            'project_id' => Rules::getRuleByKey('project_id'),
            'wp_post_id' => Rules::getRuleByKey('integer'),
            'title' => Rules::getRuleByKey('title'),
            'description' => Rules::getRuleByKey('description'),
            'long_description' => Rules::getRuleByKey('long_description'),
            'status' => Rules::getRuleByKey('asset_status'),
            'video' => Rules::getRuleByKey('video'),
            'id' => Rules::getRuleByKey('asset_id'),
            'asset_id' => Rules::getRuleByKey('asset_hash_id'),
            'external_id' => Rules::getRuleByKey('asset_hash_id'),
            'ids' => Rules::getRuleByKey('array'),
            'url' => Rules::getRuleByKey('url'),
            'ids.*' => Rules::getRuleByKey('asset_id'),
            'tag_ids' => Rules::getRuleByKey('array'),
            'tag_ids.*' => Rules::getRuleByKey('tagId'),
            'end_on' => Rules::getRuleByKey('date_time'),
            'vdms_id' => Rules::getRuleByKey('string'),
            'path_mezaninne' => Rules::getRuleByKey('string'),
            'start_on' => Rules::getRuleByKey('date_time'),
            'access_hash' => Rules::getRuleByKey('access_hash'),
            'type' => Rules::getRuleByKey('asset_type'),
            'type_arr.*' => Rules::getRuleByKey('asset_type'),
            'type_arr' => Rules::getRuleByKey('array'),
            'excludeIds' => Rules::getRuleByKey('string'),
            'assets' => Rules::getRuleByKey('array'),
            'assets.*.url' => Rules::getRuleByKey('url'),
            'assets.*.poster' => Rules::getRuleByKey('image'),
            'assets.*.cover' => Rules::getRuleByKey('image'),
            'assets.*.wp_post_id' => Rules::getRuleByKey('wp_post_id'),
            'assets.*.company_id' => Rules::getRuleByKey('company_id'),
            'assets.*.project_id' => Rules::getRuleByKey('project_id'),
            'assets.*.title' => Rules::getRuleByKey('title'),
            'assets.*.description' => Rules::getRuleByKey('description'),
            'assets.*.long_description' => Rules::getRuleByKey('long_description'),
            'assets.*.status' => Rules::getRuleByKey('asset_status'),
            'assets.*.video' => Rules::getRuleByKey('video'),
            'assets.*.asset_id' => Rules::getRuleByKey('asset_hash_id'),
            'assets.*.external_id' => Rules::getRuleByKey('asset_hash_id'),
            'assets.*.tag_ids' => Rules::getRuleByKey('array'),
            'assets.*.tag_ids.*' => Rules::getRuleByKey('tagId'),
            'assets.*.is_main' => Rules::getRuleByKey('boolean'),
            'assets.*.end_on' => Rules::getRuleByKey('date_time'),
            'assets.*.vdms_id' => Rules::getRuleByKey('string'),
            'assets.*.path_mezaninne' => Rules::getRuleByKey('string'),
            'assets.*.start_on' => Rules::getRuleByKey('date_time'),
            'assets.*.access_hash' => Rules::getRuleByKey('access_hash'),
            'assets.*.type' => Rules::getRuleByKey('asset_type'),
            'assets.*.action' => Rules::getRuleByKey('crud_action'),
        ];

        $routeName = (string)$this->route()->getName();

        switch($routeName) {
             case 'asset.import':
                $rules['assets'][] = 'required';
                $rules['assets.*.title'][] = 'required';
                $rules['assets.*.project_id'][] = 'required';
                $rules['assets.*.company_id'][] = 'required';
                $rules['assets.*.action'][] = 'required';
            break;

            case 'asset.destroy':
                $rules['ids'][] = 'required';
            break;

            case 'asset.show':
                $rules['id'][] = 'required';
            break;

            case 'asset.update':
                $rules['id'][] = 'required';
            break;

            case 'asset.store':
                $rules['title'][] = 'required';
                $rules['project_id'][] = 'required';
                $rules['company_id'][] = 'required';
            break;

            case 'asset.hook.publish':
               $rules['access_hash'][] = 'required';
               $rules['status'] = 'required|in:ok'; //Not asset status
               $rules['external_id'][] = 'required';
               $rules['asset_id'] = 'string|required';
            break;

            case 'asset.upload.video':
                $rules['id'][] = 'required';
                $rules['video'][] = 'required';
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
