<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

final class PermissionGroup extends Enum
{
    const Asset = 'Assets';
    const Article = 'Articles';
    const Livefeed = 'Livefeeds';
    const AppUser = 'App users';
    const CmsUser = 'CMS users';
    const Banner = 'Banners';
    const CallbackEndpoint = 'Callback endpoints';
    const Company = 'Companies';
    const Device = 'Devices';
    const Event = 'Events';
    const Metadata = 'Metadata';
    const Navigation = 'Navigation';
    const Password = 'Password';
    const Permission = 'Permissions';
    const Playlist = 'Playlists';
    const Program = 'Programs';
    const Project = 'Projects';
    const Role = 'Roles';
    const Show = 'Shows';
    const StaticPage = 'Static pages';
    const EPG = 'EPG';
    const Tag = 'Tags';
    const Revision = 'Revisions';
}
