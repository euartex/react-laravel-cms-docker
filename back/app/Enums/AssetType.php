<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

final class AssetType extends Enum
{
    const Video = 'video';
    const Article = 'article';
    const Livefeed = 'livefeed';
}
