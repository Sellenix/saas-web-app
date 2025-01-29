<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Mollie\Laravel\Facades\Mollie;

class VerifyMollieWebhook
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->has('id')) {
            return response('Invalid request', 400);
        }

        $paymentId = $request->input('id');
        $payment = Mollie::api()->payments->get($paymentId);

        if ($payment->webhookUrl !== route('webhooks.mollie')) {
            return response('Invalid webhook URL', 400);
        }

        return $next($request);
    }
}

