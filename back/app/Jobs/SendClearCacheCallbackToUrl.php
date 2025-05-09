<?php

namespace App\Jobs;

use App\CallbackEndpoint;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use App\Callback;

class SendClearCacheCallbackToUrl implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $callback_endpoint;
    protected $callback;

    /**
     * SendClearCachePostback constructor.
     * @param CallbackEndpoint $callback_endpoint
     * @param Callback $callback
     */

    public function __construct(CallbackEndpoint $callback_endpoint, Callback $callback)
    {
        $this->queue = 'default';
        $this->callback_endpoint = $callback_endpoint;
        $this->callback = $callback;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            $body = [
                'id' => $this->callback->getId(),
                'action' => $this->callback->getAction(),
                'type' => $this->callback->getType()
            ];

            $response = Http::post($this->callback_endpoint->url, $body);

            /**
             * Write last sent date if  response is successful (Determine if the status code is >= 200 and < 300...)
             */
            $this->callback_endpoint->last_sent_at = now();
            $this->callback_endpoint->last_http_response_code = $response->status();
            $this->callback_endpoint->last_sent_body = collect($body)->toJson();
            $this->callback_endpoint->save();

            /**
             * Write to log if response was failed
             */
            if ($response->failed()) {
                if ($response->clientError()) {
                    //catch all 400 exceptions
                    Log::debug('client Error occurred in get request.');
                    $response->throw();
                }
                if ($response->serverError()) {
                    //catch all 500 exceptions
                    Log::debug('server Error occurred in get request.');
                    $response->throw();
                }
            }

        } catch (\Exception $exception) {

            $this->failed($exception);
        }
    }

    /**
     * @param \Exception $exception
     */
    public function failed(\Exception $exception)
    {
        Log::info($exception->getMessage());
        Log::debug($exception);
    }
}
