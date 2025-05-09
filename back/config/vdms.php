<?php

return [
    'apiKey' => env('VDMS_API_KEY'),
    'userId' => env('VDMS_USER_ID'),
    'apiUrl' => env('VDMS_API_URL', 'https://services.uplynk.com'),
    'VDMSFolder' => env('VDMS_FOLDER'),
    'mezaninne' => env('MEZANINNE_PATH'),
    'url' => env('VDMS_URL', 'https://content.uplynk.com'),
    'extension' => env('VDMS_EXTENSION', 'm3u8'),
    'maxAssetsPerGetRequest' => env('VDMS_MAX_GET_ASSETS_REQUEST', 1000), //https://docs.vdms.com/video/Content/Develop/Asset.htm#getassetbyid
];
