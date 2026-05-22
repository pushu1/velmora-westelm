<?php

namespace App\Providers;

use App\Models\Setting;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class PaymentConfigServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Guard to prevent crashes during migrations or when DB is not yet set up
        try {
            if (Schema::hasTable('settings')) {
                $gateway = Setting::get('payment_active_gateway', 'stripe');

                if ($gateway === 'stripe') {
                    $publicKey = Setting::get('payment_stripe_public_key');
                    $secretKey = Setting::get('payment_stripe_secret_key');
                    $webhook = Setting::get('payment_stripe_webhook_secret');

                    if (!empty($publicKey)) {
                        config(['services.stripe.key' => $publicKey]);
                    }
                    if (!empty($secretKey)) {
                        config(['services.stripe.secret' => $secretKey]);
                    }
                    if (!empty($webhook)) {
                        config(['services.stripe.webhook_secret' => $webhook]);
                    }
                } elseif ($gateway === 'razorpay') {
                    $publicKey = Setting::get('payment_razorpay_public_key');
                    $secretKey = Setting::get('payment_razorpay_secret_key');
                    $webhook = Setting::get('payment_razorpay_webhook_secret');

                    // Override corresponding Razorpay configuration arrays dynamically
                    if (!empty($publicKey)) {
                        config(['services.razorpay.key' => $publicKey]);
                    }
                    if (!empty($secretKey)) {
                        config(['services.razorpay.secret' => $secretKey]);
                    }
                    if (!empty($webhook)) {
                        config(['services.razorpay.webhook_secret' => $webhook]);
                    }
                }
            }
        } catch (\Exception $e) {
            // Silently absorb exceptions if DB connection is offline during compile or boot
        }
    }
}
