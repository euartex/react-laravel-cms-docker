<?php

namespace App\Services\WPService;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Http\Exceptions\HttpResponseException;


/**
 * Class WPService
 * @package App\Services\WPService
 */
class WPService
{
    /**
     * Http guzzle client
     * @var Client
     */
    protected $http;

    /**
     * API endpoint
     * @var \Illuminate\Config\Repository|mixed
     */
    protected $apiEndpoint;

    /**
     * Auth string
     * @var \Illuminate\Config\Repository|mixed
     */
    protected $authBasic;

    /**
     * Headers http client
     * @var array
     */
    protected $headers;

    /**
     * WPService constructor.
     * @param Client $client
     */
    public function __construct(Client $client)
    {
        $this->apiEndpoint = config('wp.url');
        $this->authBasic = config('wp.authBasic');
        $this->http = $client;
        $this->headers = [
            'Authorization' => ['Basic ' . $this->authBasic]
        ];
    }

    /**
     * Send request to WP System
     * @param $url
     * @param $method
     * @param null $post_data
     * @param null $query
     * @return HttpResponseException|mixed
     */
    public function sendRequest($url, $method, $post_data = null, $query = null)
    {
        $route = $this->apiEndpoint . $url;

        try {
            $response = $this->http->$method($route, [
                'headers' => $this->headers,
                'timeout' => 30,
                'connect_timeout' => true,
                'http_errors' => true,
                'form_params' => $post_data,
                'query' => $query
            ]);

            return json_decode($response->getBody()->getContents(), true);
        } catch (RequestException $e) {
            return new HttpResponseException(response()->json(
                $this->getException($e)
                , ($e->getCode()) ? $e->getCode() : 500 ));
        }

    }

    /**
     * Handle response
     * @param $response
     * @return mixed
     */

    public function __getResponse($response)
    {
        if ($response instanceof HttpResponseException) {
            throw $response;
        }

        return $response;
    }

    /**
     * Handle exception (all types 500, 400 errors, CURL errors)
     * @param RequestException $e
     * @return array
     */
    public function getException(RequestException $e)
    {

        if ($e->hasResponse())
            $messageException = json_decode($e->getResponse()->getBody())->message;
        else {
            $messageException = 'Something went wrong';
        }

        $exception = [
            'message' => $messageException
        ];

        if (config('app.debug') == true)
            $exception = array_merge($exception, ['debug' => $e->getMessage()]);

        return $exception;
    }
}
