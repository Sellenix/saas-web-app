protected $routeMiddleware = [
    // ...
    'verify.mollie.webhook' => \App\Http\Middleware\VerifyMollieWebhook::class,
];

