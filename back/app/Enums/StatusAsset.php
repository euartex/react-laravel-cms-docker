<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

final class StatusAsset extends Enum
{
    const Published = 'published';
    //const Unpublished = 'unpublished';
    //const Converting = 'converting';
    const Draft = 'draft';
    const WpAutoDraft = 'wp_auto_draft';
    const Uploading = 'uploading';
}
