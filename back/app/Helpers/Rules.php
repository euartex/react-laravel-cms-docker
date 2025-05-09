<?php

namespace App\Helpers;
use App\Enums\PermissionAction;
use App\Enums\StaticPageType;
use Config;
use App\Enums\ProgramType;
use App\Enums\RatingValue;
use App\Enums\StatusAsset;
use App\Enums\AssetType;
use App\Enums\RevisionModel;
use App\Enums\CrudAction;
use BenSampo\Enum\Rules\EnumValue;


class Rules
{
    public static function getRuleByKey($key) {

        $rules = [
            //EPG
            'xls' => ['mimes:xls,xlsx'],

            /**
             * Callback endpoints
             */
            'callback_endpoint_url' => ['url', 'unique:callback_endpoints,url', 'nullable'],

            //General
            'integer' => ['integer','nullable'],
            'string' => ['string','nullable'],
            'array' => ['array','nullable'],
            'q' => ['string','nullable'],
            'email' => ['email','nullable'],
            'boolean' => ['bln'],
            'access_hash' => ['string', 'in:'.Config::get('auth.access_hash').''],
            'date_time' => ['date_format:Y-m-d H:i:s','nullable'],
            'url' => ['url','nullable'],
            'crud_action' => ['string','in:'.implode(',', CrudAction::getValues()).'','nullable'],

            //Banners
            'banner_id' => ['integer', 'exists:banners,id', 'nullable'],

            //Livefeed
            'livefeed_id' => ['integer', 'exists:livefeeds,id', 'nullable'],
            'livefeed_hash_id' => ['integer', 'exists:livefeeds,livefeed_id', 'nullable'],

            //Revision
            'model_type' => ['string','in:'.implode(',', RevisionModel::getValues()).'','nullable'],

            //Assets
            'asset_hash_id' => ['string','exists:App\Asset,asset_id','nullable'],
            'asset_id' => ['integer','exists:App\Asset,id','nullable'],
            'wp_post_id' => ['integer','nullable', function($attribute, $value, $fail){

                  $index = intval($attribute);
             
                  switch(app()['request']->assets[$index]['action']){

                        case CrudAction::Store:

                              if($value and \App\Asset::whereWpPostId($value)->exists()) return $fail($attribute . ' is alredy exists.');
                        break;

                        case CrudAction::Save:

                              if($value and !\App\Asset::whereWpPostId($value)->exists()) return $fail($attribute . '  does not exists.');
                        break;

                        case CrudAction::Destroy:

                              if($value and !\App\Asset::whereWpPostId($value)->exists()) return $fail($attribute . '  does not exists.');
                        break;
                  }
            }],
            'sortDesc' => ['regex:/^([a-_z]+\,?)+$/','nullable'],
            'sort' => ['regex:/^([a-z_]+\,?)+$/','nullable'],
            'asset_status' => ['string','nullable', 'in:'.implode(',', StatusAsset::getValues()).''],
            'title' => ['string', 'max:255'],
            'description' => ['string', 'max:5000'],
            'long_description' => ['string', 'max:25000'],
            'date' => ['date_format:Y-m-d', 'nullable'],
            'asset_type' => ['string', 'in:'.implode(',', AssetType::getValues()), 'nullable'],
            //'wp_post_id' => ['integer','unique:App\Asset,wp_post_id','nullable'],

            //Tags
            'tagId' => ['integer', 'exists:tags,id'],

            //Metadata
            'metadataId' => ['integer', 'exists:metadata,id', 'nullable'],

            //Roles
            'permission_id' => ['integer','nullable', 'exists:permissions,id'],
            'role_id' => ['integer','nullable', 'exists:roles,id'],

            //Users
            'password' => ['max:50','min:4'],
            'last_name' => ['string','max:50','min:2','nullable'],
            'first_name' => ['string','max:50','min:2','nullable'],

            //App users
            'unique_app_user_email' => ['email','max:50','nullable', 'unique:users,email'],
            'exists_app_user_email' => ['email','max:50','nullable', 'exists:users,email'],

            //CMS users
            'exists_cms_user_email' => ['email','max:50','nullable', 'exists:cms_users,email'],
            'unique_cms_user_email' => ['email','max:50','nullable', 'unique:cms_users,email'],
            'phone' => ['string','max:15','min:7','nullable'],

            //Company
            'company_id' => ['integer','exists:App\Company,id'],
            'company_string' => ['string', 'min:2', 'max:100', 'nullable'],

            //Auth
            'refresh_token' => ['string', 'nullable'],

            //Reset password
            'reset_password_token' => ['string','exists:App\PasswordReset,token', 'nullable'],

            //Project
            'project_id' => ['integer','exists:App\Project,id'],

            //Playlist
            'playlist_id' => ['integer','exists:App\Playlist,id','nullable'],

            //Static pages
            'static_page_title' => ['string','max:50','min:2','nullable'],
            'static_page_html' => ['string','nullable'],
            'static_page_order' => ['integer','exists:App\StaticPage,order','nullable'],
            'static_page_type' => [new EnumValue(StaticPageType::class,false),'nullable'],

            //Show
            'show_id' => ['integer','exists:App\Show,id','nullable'],
            'show_title' => ['string','max:50','min:2','nullable'],
            'show_description' => ['string','max:250','min:2','nullable'],

            //Programs
            'program_name' => ['string','max:100','min:2','nullable'],
            'program_start_at' => ['date_format:Y-m-d H:i','nullable'],
            'program_end_at' => ['date_format:Y-m-d H:i','after:start_show_at', "before:".date('Y-m-d H:i', strtotime( request()->get('start_show_at') . ' +1 day'))."",  'nullable'],
            'program_end_at_not_request' => ['date_format:Y-m-d H:i','after:start_show_at','nullable'],
            'program_type' => [new EnumValue(ProgramType::class,false),'nullable'],

            //Navigation
            'navigation_type_id' => ['integer','exists:App\NavigationType,id','nullable'],
            'navigation_string' => ['string', 'max:500','min:2','nullable'],
            'navigation_id' => ['integer','exists:App\Navigation,id','nullable'],

            //Uploading image
            'image' => ['image', 'mimes:jpeg,png,jpg', 'max:4096'],
            'video'=> ['file', 'mimes:mp4,avi,mov'],

        ];


        return $rules[$key];
    }
}
