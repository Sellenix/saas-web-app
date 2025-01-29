<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Subscription;
use App\Services\PaymentService;

class RenewSubscriptions extends Command
{
    protected $signature = 'subscriptions:renew';
    protected $description = 'Renew expiring subscriptions';

    public function __construct(private PaymentService $paymentService)
    {
        parent::__construct();
    }

    public function handle()
    {
        $expiringSubscriptions = Subscription::where('expires_at', '<=', now()->addDays(3))->get();

        foreach ($expiringSubscriptions as $subscription) {
            try {
                $this->paymentService->renewSubscription($subscription);
                $this->info("Renewed subscription for user {$subscription->user_id}");
            } catch (\Exception $e) {
                $this->error("Failed to renew subscription for user {$subscription->user_id}: {$e->getMessage()}");
            }
        }
    }
}

