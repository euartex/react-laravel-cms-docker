<?php

use Illuminate\Support\Str;

return [
    'url' => env('FRONTEND_URL', 'http://localhost:8080'),
    // path to my frontend page with query param queryURL(temporarySignedRoute URL)
    'email_verify_url' => env('FRONTEND_EMAIL_VERIFY_URL', '/email-verification'),
    'password_reset_path' => env('FRONTEND_PASSWORD_RESET_PATH', '/email-verification')
];
