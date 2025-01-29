<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\QuestionnaireController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ResponseController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::get('/user', [UserController::class, 'show']);
    Route::put('/user', [UserController::class, 'update']);
    Route::put('/user/password', [UserController::class, 'updatePassword']);
    
    Route::apiResource('questionnaires', QuestionnaireController::class);
    Route::get('/questionnaires/{id}/public-url', [QuestionnaireController::class, 'getPublicUrl']);
    
    Route::post('/payments', [PaymentController::class, 'createPayment']);
    Route::get('/payments/history', [PaymentController::class, 'getPaymentHistory']);
    
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    
    Route::get('/responses/recent', [ResponseController::class, 'getRecentResponses']);
    
    // Test route for email
    Route::get('/test-email', [PaymentController::class, 'testEmail']);
    
    Route::middleware('admin')->group(function () {
        Route::get('/admin/users', [AdminController::class, 'index']);
        Route::put('/admin/users/{user}', [AdminController::class, 'update']);
    });
});

Route::post('/webhooks/mollie', [PaymentController::class, 'handleWebhook']);
Route::get('/payment/success', [PaymentController::class, 'success'])->name('payment.success');

