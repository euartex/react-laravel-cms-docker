<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static Privacy()
 */
final class StaticPageType extends Enum
{
    const Privacy = 'privacy';
    const WebContent = 'web-content';
    const Other = 'other';
}
