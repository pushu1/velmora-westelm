<?php

use App\Http\Controllers\Client\NavigationController;
use App\Http\Controllers\Client\PaymentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| E-Commerce Client API Routes
|--------------------------------------------------------------------------
*/

// 1. Dynamic Megamenu Header Taxonomy Tree API
Route::get('/navigation', [NavigationController::class, 'getHeaderNavigation']);

// 2. Stripe Checkout session initializer (supports authentication fallback)
Route::post('/payment/checkout', [PaymentController::class, 'createCheckoutSession']);

// 3. Secure Signature Hook verification webhook (exempted from CSRF)
Route::post('/payment/webhook', [PaymentController::class, 'handleWebhook']);

// 4. Categories retrieval endpoint for decoupled frontend
Route::get('/categories', [\App\Http\Controllers\Admin\CategoryController::class, 'apiIndex']);

// 5. Secure Admin APIs
Route::prefix('admin')->group(function () {
    // Product creation endpoint accepting multipart/form-data
    Route::post('/products', [\App\Http\Controllers\Admin\ProductController::class, 'apiStore']);

    // Multi-tier Category management
    Route::get('/categories', [\App\Http\Controllers\Admin\CategoryController::class, 'apiAdminIndex']);
    Route::post('/categories', [\App\Http\Controllers\Admin\CategoryController::class, 'apiStore']);
    Route::delete('/categories/{category}', [\App\Http\Controllers\Admin\CategoryController::class, 'apiDestroy']);

    // Bulk Excel Ingestion
    Route::post('/bulk-upload', [\App\Http\Controllers\Admin\ExcelIngestionController::class, 'apiStore']);
    Route::get('/bulk-upload/status/{token}', [\App\Http\Controllers\Admin\ExcelIngestionController::class, 'apiCheckStatus']);

    // User Directory Audit
    Route::get('/users', [\App\Http\Controllers\Admin\UserAuditController::class, 'apiIndex']);
    Route::put('/users/{user}', [\App\Http\Controllers\Admin\UserAuditController::class, 'apiUpdate']);
    Route::delete('/users/{user}', [\App\Http\Controllers\Admin\UserAuditController::class, 'apiDestroy']);

    // Executive Stats Dashboard
    Route::get('/dashboard/stats', [\App\Http\Controllers\Admin\DashboardController::class, 'apiStats']);

    // Coupon Promotions Engine
    Route::get('/coupons', [\App\Http\Controllers\Admin\CouponController::class, 'apiIndex']);
    Route::post('/coupons', [\App\Http\Controllers\Admin\CouponController::class, 'apiStore']);
    Route::delete('/coupons/{coupon}', [\App\Http\Controllers\Admin\CouponController::class, 'apiDestroy']);

    // Dynamic Payment Settings Configuration Panel
    Route::get('/settings/payment', [\App\Http\Controllers\Admin\SettingController::class, 'getPaymentSettings']);
    Route::post('/settings/payment', [\App\Http\Controllers\Admin\SettingController::class, 'savePaymentSettings']);
});

