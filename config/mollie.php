<?php

return [
    'key' => env('MOLLIE_KEY'),
    'webhook_url' => env('APP_URL') . '/api/webhooks/mollie',
    'redirect_url' => env('APP_URL') . '/payment/success',
];

