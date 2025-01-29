<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubscriptionRenewalNotification extends Notification
{
    use Queueable;

    public function __construct(private $renewalDate)
    {}

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->subject('Your Subscription Has Been Renewed')
                    ->line('Your WebWizardTool subscription has been successfully renewed.')
                    ->line('Your next billing date is: ' . $this->renewalDate->format('Y-m-d'))
                    ->action('View Your Account', url('/dashboard'))
                    ->line('Thank you for using our application!');
    }
}

