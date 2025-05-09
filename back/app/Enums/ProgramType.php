<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static Live()
 * @method static static Repeat()
 * @method static static FirstRun()
 */
final class ProgramType extends Enum
{
    const Live = 'live';
    const Repeat = 'repeat';
    const First_Run = 'first_run';
    const Canned = 'canned';
}
