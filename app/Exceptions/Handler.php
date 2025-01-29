<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;

class Handler extends ExceptionHandler
{
    public function render($request, Throwable $exception)
    {
        if ($exception instanceof AuthenticationException) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        if ($exception instanceof ValidationException) {
            return response()->json(['error' => $exception->errors()], 422);
        }

        return parent::render($request, $exception);
    }
}

