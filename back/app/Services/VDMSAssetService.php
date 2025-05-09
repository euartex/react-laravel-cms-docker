<?php

namespace App\Services;

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class VDMSAssetService
{
    /**
     * @var VDMSService
     */
    protected $VDMSService;

    public function __construct(VDMSService $VDMSService)
    {
        $this->VDMSService = $VDMSService;
    }

    /**
     * @param array $ids
     *
     * @return bool
     */
    public function destroy(Array $ids)
    {

        $response = $this->VDMSService->request('/api2/asset/delete', ['ids' => $ids]);

        return true;
    }

    /**
     * @param $ids integer|array
     *
     * @return array|null|bool
     */
    public function get(Array $ids)
    {
        return $this->VDMSService->request('/api2/asset/get', ['ids' => $ids]);
    }

    /**
     * @param $id string
     * @param array $data
     *
     * @return array|null
     */
    public function update($id, $data = [])
    {
        $data['id'] = $id;
        if (isset($data['meta'])) {
            $data['meta'] = json_encode($data['meta']);
        }
        $response = $this->VDMSService->request('/api2/asset/update', $data);

        if (isset($response['asset'])) {
            return $response['asset'];
        }

        return null;
    }

    /**
     * @param object $asset
     *
     * @return bool
     */
    public function storeToVDMS($asset)
    {
        $destinationPath = $this->VDMSService->publicVDMSFolder . '/';
        $sourceFilePath = $this->VDMSService->mezaninne . '/' . $asset->path_mezaninne;

        File::move($sourceFilePath, $destinationPath . $asset->asset_id . '^skip_drm=1^external_id=' . $asset->asset_id . '^description=' . Str::slug($asset->title) . '.' . (pathinfo($asset->path_mezaninne))['extension']);

        return true;
    }

}
