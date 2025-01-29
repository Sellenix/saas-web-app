<?php

return [
    // ... andere services configuratie

    'mollie' => [
        'test_key' => env('MOLLIE_KEY'),
        'webhook_secret' => env('MOLLIE_WEBHOOK_SECRET'),
    ],
];

