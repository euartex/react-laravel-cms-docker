<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static Delete()
 * @method static static Save()
 * @method static static Store()
 */
final class CrudAction extends Enum
{
    const Destroy = 'destroy';
    const Save = 'save';
    const Store = 'store';
}
