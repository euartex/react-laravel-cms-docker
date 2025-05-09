<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Asset;
use Illuminate\Support\Facades\Log;
use PhpParser\Node\Expr\Array_;

class AssetPublished extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * The asset instance.
     *
     * @var Asset
     */

    public $asset;


    /**
     * Email addresses
     * @var array
     */
    public $toEmails;

    /**
     * Create a new message instance.
     *
     * @param \App\Asset $asset
     * @param array $toEmails
     * @return void
     */
    public function __construct(Asset $asset, $toEmails)
    {
        $this->asset = $asset;
        $this->toEmails = $toEmails;
    }


    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $this->to($this->toEmails)->subject('New Asset published' . ' ' . $this->asset->title)->view('mail.asset_published');
    }

}
