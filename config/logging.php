'channels' => [
    'stack' => [
        'driver' => 'stack',
        'channels' => ['single', 'slack'],
        'ignore_exceptions' => false,
    ],
    'single' => [
        'driver' => 'single',
        'path' => storage_path('logs/laravel.log'),
        'level' => 'debug',
    ],
    'slack' => [
        'driver' => 'slack',
        'url' => env('LOG_SLACK_WEBHOOK_URL'),
        'username' => 'Laravel Log',
        'emoji' => ':boom:',
        'level' => 'critical',
    ],
],

