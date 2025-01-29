<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class PaymentConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $surveys;

    public function __construct(User $user, int $surveys)
    {
        $this->user = $user;
        $this->surveys = $surveys;
    }

    public function build()
    {
        return $this->subject('Payment Confirmation - WebWizardTool')
                    ->view('emails.payment-confirmation');
    }
}

