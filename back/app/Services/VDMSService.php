<?php

namespace App\Services;

class VDMSService
{
    /**
     * @var string
     */
    protected $apiKey;

    /**
     * @var string
     */
    protected $userId;

    /**
     * @var string
     */
    protected $url;

    /**
     * @var string
     */
    public $publicVDMSFolder;

    /**
     * @var string
     */
    public $mezaninne;

    public function __construct($config)
    {
        $this->apiKey           = $config['apiKey'];
        $this->userId           = $config['userId'];
        $this->url              = $config['apiUrl'];
        $this->publicVDMSFolder = $config['VDMSFolder'];
        $this->mezaninne =        $config['mezaninne'];
    }

    /**
     * @param  string  $uri
     * @param  array  $data
     *
     * @return bool|string
     * @link https://docs.vdms.com/video/Content/Develop/Third-Party-Integration.htm#MessagesSignatures
     */
    public function request($uri = '', $data = [])
    {
        $data['_owner']     = $this->userId;
        $data['_timestamp'] = time();

        $data               = json_encode($data);
        $data               = base64_encode(gzcompress($data, 9));
        $sig                = hash_hmac('sha256', $data, $this->apiKey);
        $sig                = trim($sig);

        $body               = $this->encodeArray(array('msg' => $data, 'sig' => $sig));
        $ch                 = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->url . $uri);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $result = curl_exec($ch);
        curl_close($ch);

        return json_decode($result, true);
    }

    /**
     * @param $args
     *
     * @return bool|string
     * @link https://docs.vdms.com/video/Content/Develop/Third-Party-Integration.htm#MessagesSignatures
     */
    protected function encodeArray($args)
    {
        if ( ! is_array($args)) {
            return false;
        }
        $c   = 0;
        $out = '';
        foreach ($args as $name => $value) {
            if ($c++ != 0) {
                $out .= '&';
            }
            $out .= urlencode("$name") . '=';
            if (is_array($value)) {
                $out .= urlencode(serialize($value));
            } else {
                $out .= urlencode("$value");
            }
        }

        return $out . "\n";
    }
}
