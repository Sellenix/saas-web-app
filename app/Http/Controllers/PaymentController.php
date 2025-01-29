<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Subscription;
use App\Models\Payment;
use Illuminate\Http\Request;
use Mollie\Laravel\Facades\Mollie;
use Illuminate\Support\Facades\Log;
use App\Exceptions\PaymentException;
use Illuminate\Support\Facades\Mail;
use App\Mail\PaymentConfirmation;

class PaymentController extends Controller
{
    public function createPayment(Request $request)
    {
        try {
            $user = auth()->user();
            $amount = $request->input('amount');
            $surveys = $request->input('surveys');
            $isYearly = $request->input('isYearly', false);
            $acceptedTerms = $request->input('acceptedTerms', false);

            if (!$acceptedTerms) {
                throw new PaymentException('You must accept the terms and conditions to proceed with the payment.');
            }

            $payment = Payment::create([
                'user_id' => $user->id,
                'amount' => $amount,
                'surveys' => $surveys,
                'is_yearly' => $isYearly,
                'status' => 'pending'
            ]);

            $molliePayment = Mollie::api()->payments->create([
                "amount" => [
                    "currency" => "EUR",
                    "value" => number_format($amount, 2, '.', '')
                ],
                "description" => "$surveys Survey(s) " . ($isYearly ? "Yearly" : "Monthly") . " Subscription for " . $user->name,
                "redirectUrl" => route('payment.success'),
                "webhookUrl" => route('webhooks.mollie'),
                "metadata" => [
                    "payment_id" => $payment->id,
                    "user_id" => $user->id,
                    "surveys" => $surveys,
                    "is_yearly" => $isYearly,
                ],
            ]);

            $payment->update([
                'mollie_payment_id' => $molliePayment->id
            ]);

            Log::info('Payment created', [
                'payment_id' => $payment->id,
                'mollie_payment_id' => $molliePayment->id,
                'amount' => $amount,
                'is_yearly' => $isYearly,
            ]);

            return response()->json([
                'payment_url' => $molliePayment->getCheckoutUrl()
            ]);

        } catch (\Exception $e) {
            Log::error('Payment creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new PaymentException('Payment creation failed. Please try again later.');
        }
    }

    public function handleWebhook(Request $request)
    {
        try {
            Log::info('Webhook received', $request->all());

            $paymentId = $request->input('id');
            $molliePayment = Mollie::api()->payments->get($paymentId);
            
            $payment = Payment::where('mollie_payment_id', $paymentId)->firstOrFail();
            
            Log::info('Processing webhook', [
                'mollie_status' => $molliePayment->status,
                'payment_id' => $payment->id
            ]);

            $payment->status = $molliePayment->status;
            $payment->save();

            if ($molliePayment->isPaid()) {
                Subscription::updateOrCreate(
                    ['user_id' => $payment->user_id],
                    [
                        'surveys' => $payment->surveys,
                        'expires_at' => now()->addMonth()
                    ]
                );

                Log::info('Payment completed successfully', [
                    'payment_id' => $payment->id,
                    'user_id' => $payment->user_id
                ]);
            } elseif ($molliePayment->isFailed() || $molliePayment->isExpired()) {
                Log::warning('Payment failed or expired', [
                    'payment_id' => $payment->id,
                    'user_id' => $payment->user_id,
                    'status' => $molliePayment->status
                ]);
            }

            return response()->json(['status' => 'processed']);

        } catch (\Exception $e) {
            Log::error('Webhook processing failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Webhook processing failed'], 500);
        }
    }

    public function success(Request $request)
    {
        return view('payment.success');
    }

    public function testEmail()
    {
        try {
            $user = User::first(); // Haal de eerste gebruiker op voor de test
            if (!$user) {
                throw new \Exception('Geen gebruiker gevonden voor de test.');
            }

            Mail::to($user->email)->send(new PaymentConfirmation($user, 1));
            
            Log::info('Test e-mail verzonden', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);

            return response()->json(['message' => 'Test e-mail succesvol verzonden']);
        } catch (\Exception $e) {
            Log::error('Test e-mail verzenden mislukt', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Test e-mail verzenden mislukt: ' . $e->getMessage()], 500);
        }
    }
}

