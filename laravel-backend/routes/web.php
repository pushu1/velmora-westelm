<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ExcelIngestionController;
use App\Http\Controllers\Admin\UserAuditController;
use App\Http\Controllers\Admin\CouponController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Storefront Client Routes
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return view('layouts.app'); // Renders beautiful main layout as storefront entry
});

Route::get('/checkout/success', function () {
    return "<h2>💳 Stripe Payment Completed! Order verified successfully. Check log systems.</h2>";
})->name('client.checkout.success');

Route::get('/checkout/cancel', function () {
    return "<h2>❌ Stripe Payment Cancelled.</h2>";
})->name('client.checkout.cancel');

/*
|--------------------------------------------------------------------------
| Admin Portal Pipeline Routes Group
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->group(function () {
    
    // 1. Dashboard Aggregates View
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // 2. Product Injection Controls
    Route::get('products', [ProductController::class, 'index'])->name('products.index');
    Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('products', [ProductController::class, 'store'])->name('products.store');
    Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    // 3. Category Hierarchy Tree
    Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    // 4. Bulk Excel Ingestion Processing
    Route::get('excel', [ExcelIngestionController::class, 'index'])->name('excel.index');
    Route::post('excel', [ExcelIngestionController::class, 'store'])->name('excel.store');
    Route::get('excel/status/{token}', [ExcelIngestionController::class, 'checkStatus'])->name('excel.status');

    // 5. User Auditing Datatable
    Route::get('users', [UserAuditController::class, 'index'])->name('users.index');
    Route::put('users/{user}', [UserAuditController::class, 'update'])->name('users.update');
    Route::delete('users/{user}', [UserAuditController::class, 'destroy'])->name('users.destroy');

    // 6. Coupon Promotions Engine
    Route::get('coupons', [CouponController::class, 'index'])->name('coupons.index');
    Route::post('coupons', [CouponController::class, 'store'])->name('coupons.store');
    Route::post('coupons/{coupon}/toggle', [CouponController::class, 'toggle'])->name('coupons.toggle');
    Route::delete('coupons/{coupon}', [CouponController::class, 'destroy'])->name('coupons.destroy');
});
