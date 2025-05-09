<?php

namespace App\Enums;

use BenSampo\Enum\Enum;


final class StatusCode extends Enum
{
    const SUCCESS = 200;
    const BAD_REQUEST = 400;
    const VALIDATION_ERROR = 401;
    const NOT_FOUND = 404;
    const FATAL_ERROR = 500;
}
