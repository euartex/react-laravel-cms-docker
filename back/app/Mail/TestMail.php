<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TestMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Email address
     * @var array
     */
    public $toEmail;

    /**
     * Create a new message instance.
     * @param $toEmail string
     * @return void
     */
    public function __construct($toEmail)
    {
        $this->toEmail = $toEmail;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->to($this->toEmail)->subject('Test Email')->view('mail.test_email');
    }
}
