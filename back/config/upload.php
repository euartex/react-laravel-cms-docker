<?php

return [

    'uploadPathTemplateSimple'    => env('UPLOAD_PATH_TEMPLATE_SIMPLE', '/storage/'.env('APP_ENV').'/'),
    'uploadUrlPathTemplateSimple' => env('UPLOAD_URL_PATH_TEMPLATE_SIMPLE', 'storage/'.env('APP_ENV').'/'),
    'uploadPathTemplate'    => env('UPLOAD_PATH_TEMPLATE', '/storage/'.env('APP_ENV').'/{device_type_slug}/'),
    'uploadUrlPathTemplate' => env('UPLOAD_URL_PATH_TEMPLATE', 'storage/'.env('APP_ENV').'/{device_type_slug}/'),
    'uploadTempPathTemplate' => env('UPLOAD_TEMP_PATH_TEMPLATE', '{instance}/{id}/{column}'),
    'assetImportTmpFilePath' => env('ASSET_IMPORT_TMP_FILE_PATH', 'public/asset/import/tmp/')
];
