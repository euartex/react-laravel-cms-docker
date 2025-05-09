<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Config as Cnf;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Route;
use Panoscape\History\Events\ModelChanged;

class Upload extends Model
{
    public $previus_state;

    protected $appends = ['device_type_slug'];

    protected $hidden = ['created_at', 'updated_at', 'tmp', 'deleted_at', 'device_type_slug'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'original',
        'small',
        'medium',
        'large',
        'tmp'
    ];


    /**
     *   Attributes
     */
    public function getDeviceTypeSlugAttribute($value)
    {
        return (request('device_type_slug')) ? request('device_type_slug') : 'web';
    }

    public function getOriginalAttribute($value)
    {
        return $value !== null ? $this->uploadUrlByTemplate($this->device_type_slug, $value) : null;
    }

    public function getMediumAttribute($value)
    {
        return $value !== null ? $this->uploadUrlByTemplate($this->device_type_slug, $value) : null;
    }

    public function getSmallAttribute($value)
    {
        return $value !== null ? $this->uploadUrlByTemplate($this->device_type_slug, $value) : null;
    }

    public function getLargeAttribute($value)
    {
        return $value !== null ? $this->uploadUrlByTemplate($this->device_type_slug, $value) : null;
    }

    /**
     *   Custom methods
     */
    public function uploadPathByTemplate($device_type_slug, $filename = null)
    {
        return $this->preparePath(Cnf::get('upload.uploadPathTemplate'), $device_type_slug, $filename);
    }

    public function uploadUrlByTemplate($device_type_slug, $filename)
    {
        return Storage::disk(config('filesystems.cloud'))->url($this->preparePath(Cnf::get('upload.uploadUrlPathTemplate'), $device_type_slug, $filename));
    }

    public function preparePath($template_path, $device_type_slug, $filename = null)
    {

        $path = str_replace('{device_type_slug}', $device_type_slug, $template_path) . $filename;

        return $path;
    }

    public function getUploadTempPathByTemplate($column, $id, $instance = null)
    {
        if ($instance == null)
            if ($route = Route::getCurrentRoute()) $instance = strtolower(basename(explode('Controller@', class_basename($route->getAction()['controller']))[0]));

        $path = str_replace('{instance}', $instance, Cnf::get('upload.uploadTempPathTemplate'));
        $path = str_replace('{column}', $column, $path);
        $path = str_replace('{id}', $id, $path);

        return $path;
    }

    public function getUploadDataByOriginalUrl()
    {
        return $this->parseOriginalUrl($this->getRawOriginal('original'));
    }

    public function parseOriginalUrl($string)
    {
        $data = explode('/', $string);

        return ['instance' => $data[0], 'instance_id' => $data[1], 'instance_upload_type' => $data[2]];
    }

    public function postersPlaylist()
    {
        return $this->hasMany('App\Playlist', 'poster_id');
    }

    public function coversPlaylist()
    {
        return $this->hasMany('App\Playlist', 'cover_id');
    }

    public function postersAsset()
    {
        return $this->hasMany('App\Asset', 'poster');
    }

    public function coversAsset()
    {
        return $this->hasMany('App\Asset', 'cover');
    }

    /**
     *   Fire model update event for parents by relationships
     *
     * @return self
     */
    public function scopeUpdateEventForRelations()
    {
        if ($this->postersPlaylist) {
            $this->postersPlaylist->each(function ($playlist) {

                //fire a model changed event
                event(new ModelChanged($playlist, 'Playlist poster has been updated', [['key' => 'poster', 'old' => $this->previus_state->getAttribute('original') ?? null, 'new' => $this->getAttribute('original') ?? null]]));

                $playlist->touch();
            });
        }

        if ($this->coversPlaylist) {
            $this->coversPlaylist->each(function ($playlist) {

                //fire a model changed event
                event(new ModelChanged($playlist, 'Playlist cover has been updated', [['key' => 'cover', 'old' => $this->previus_state->getAttribute('original') ?? null, 'new' => $this->getAttribute('original') ?? null]]));

                $playlist->touch();
            });
        }

        if ($this->postersAsset) {
            $this->postersAsset->each(function ($asset) {

                //fire a model changed event
                event(new ModelChanged($asset, 'Asset poster has been updated', [['key' => 'poster', 'old' => $this->previus_state->getAttribute('original') ?? null, 'new' => $this->getAttribute('original') ?? null]]));

                $asset->touch();
            });
        }

        if ($this->coversAsset) {
            $this->coversAsset->each(function ($asset) {

                //fire a model changed event
                event(new ModelChanged($asset, 'Asset cover has been updated', [['key' => 'cover', 'old' => $this->previus_state->getAttribute('original') ?? null, 'new' => $this->getAttribute('original') ?? null]]));

                $asset->touch();
            });
        }

        return $this;
    }

    /**
     *   Update with new path
     *
     * @return Bool
     */
    public function saveNewPath($paths): Bool
    {

        $paths->map(function ($path) {

            $size_name = key($path);

            $this->attributes[$size_name] = $path[$size_name];

            return $this;
        });

        return $this->save();
    }

    /**
     *   Tmp file delete
     *
     * @return Bool
     */
    public function destroyTmpFile(): Bool
    {
        if (isset($this->tmp)) {

            $tmpFile = storage_path('app/public/' . $this->tmp);

            $this->tmp = null;

            if (File::exists($tmpFile)) {
                File::delete($tmpFile);
            }

            return $this->save();

        }

        return false;
    }
}
