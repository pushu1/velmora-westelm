<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Get payment settings for admin panel.
     */
    public function getPaymentSettings()
    {
        $activeGateway = Setting::get('payment_active_gateway', 'stripe');
        $testMode = Setting::get('payment_test_mode', '1') === '1';

        $stripePublicKey = Setting::get('payment_stripe_public_key', '');
        $stripeSecretKey = Setting::get('payment_stripe_secret_key', '');
        $stripeWebhook = Setting::get('payment_stripe_webhook_secret', '');

        $razorpayPublicKey = Setting::get('payment_razorpay_public_key', '');
        $razorpaySecretKey = Setting::get('payment_razorpay_secret_key', '');
        $razorpayWebhook = Setting::get('payment_razorpay_webhook_secret', '');

        // Mask values for safety
        $stripeSecretKeyMasked = $this->maskKey($stripeSecretKey, 'sk_');
        $stripeWebhookMasked = $this->maskKey($stripeWebhook, 'whsec_');

        $razorpaySecretKeyMasked = $this->maskKey($razorpaySecretKey, 'rzp_');
        $razorpayWebhookMasked = $this->maskKey($razorpayWebhook, 'rzp_sec_');

        $activePublicKey = $activeGateway === 'stripe' ? $stripePublicKey : $razorpayPublicKey;
        $activeSecretKeyMasked = $activeGateway === 'stripe' ? $stripeSecretKeyMasked : $razorpaySecretKeyMasked;
        $activeWebhookMasked = $activeGateway === 'stripe' ? $stripeWebhookMasked : $razorpayWebhookMasked;

        return response()->json([
            'success' => true,
            'active_gateway' => $activeGateway,
            'test_mode' => $testMode,
            'public_key' => $activePublicKey,
            'secret_key' => $activeSecretKeyMasked,
            'webhook_secret' => $activeWebhookMasked,
            'stripe' => [
                'public_key' => $stripePublicKey,
                'secret_key' => $stripeSecretKeyMasked,
                'webhook_secret' => $stripeWebhookMasked,
            ],
            'razorpay' => [
                'public_key' => $razorpayPublicKey,
                'secret_key' => $razorpaySecretKeyMasked,
                'webhook_secret' => $razorpayWebhookMasked,
            ]
        ]);
    }

    /**
     * Save payment settings securely.
     */
    public function savePaymentSettings(Request $request)
    {
        $request->validate([
            'active_gateway' => 'required|string|in:stripe,razorpay',
            'test_mode' => 'required|boolean',
            'public_key' => 'nullable|string|max:255',
            'secret_key' => 'nullable|string|max:255',
            'webhook_secret' => 'nullable|string|max:255',
        ]);

        $gateway = $request->active_gateway;

        Setting::set('payment_active_gateway', $gateway);
        Setting::set('payment_test_mode', $request->test_mode ? '1' : '0');

        if ($request->has('public_key')) {
            Setting::set("payment_{$gateway}_public_key", $request->public_key);
        }

        if ($request->has('secret_key') && !empty($request->secret_key)) {
            $secret = $request->secret_key;
            // Only update if it does not contain mask characters
            if (!str_contains($secret, '*')) {
                Setting::set("payment_{$gateway}_secret_key", $secret);
            }
        }

        if ($request->has('webhook_secret') && !empty($request->webhook_secret)) {
            $webhook = $request->webhook_secret;
            // Only update if it does not contain mask characters
            if (!str_contains($webhook, '*')) {
                Setting::set("payment_{$gateway}_webhook_secret", $webhook);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Gateway credentials securely updated.',
        ]);
    }

    /**
     * Mask sensitive API key strings.
     */
    private function maskKey(?string $key, string $prefixMatch = '')
    {
        if (empty($key)) {
            return '';
        }

        // If it's already masked (e.g. contains stars), return it
        if (str_contains($key, '*')) {
            return $key;
        }

        $length = strlen($key);
        if ($length <= 8) {
            return str_repeat('*', 8);
        }

        if (!empty($prefixMatch) && str_starts_with($key, $prefixMatch)) {
            $prefixLen = strlen($prefixMatch);
            // Auto detect standard formats
            if (str_starts_with($key, 'sk_test_')) {
                return 'sk_test_' . str_repeat('*', max(8, $length - 8));
            }
            if (str_starts_with($key, 'sk_live_')) {
                return 'sk_live_' . str_repeat('*', max(8, $length - 8));
            }
            if (str_starts_with($key, 'rzp_test_')) {
                return 'rzp_test_' . str_repeat('*', max(8, $length - 9));
            }
            if (str_starts_with($key, 'rzp_live_')) {
                return 'rzp_live_' . str_repeat('*', max(8, $length - 9));
            }
            if (str_starts_with($key, 'rzp_sec_')) {
                return 'rzp_sec_' . str_repeat('*', max(8, $length - 8));
            }
            if (str_starts_with($key, 'whsec_')) {
                return 'whsec_' . str_repeat('*', max(8, $length - 6));
            }

            return substr($key, 0, $prefixLen) . str_repeat('*', max(8, $length - $prefixLen));
        }

        // Auto detect without explicit match
        if (str_starts_with($key, 'sk_test_')) {
            return 'sk_test_' . str_repeat('*', max(8, $length - 8));
        }
        if (str_starts_with($key, 'sk_live_')) {
            return 'sk_live_' . str_repeat('*', max(8, $length - 8));
        }
        if (str_starts_with($key, 'rzp_test_')) {
            return 'rzp_test_' . str_repeat('*', max(8, $length - 9));
        }
        if (str_starts_with($key, 'rzp_live_')) {
            return 'rzp_live_' . str_repeat('*', max(8, $length - 9));
        }
        if (str_starts_with($key, 'rzp_sec_')) {
            return 'rzp_sec_' . str_repeat('*', max(8, $length - 8));
        }
        if (str_starts_with($key, 'whsec_')) {
            return 'whsec_' . str_repeat('*', max(8, $length - 6));
        }

        return substr($key, 0, 4) . str_repeat('*', max(8, $length - 4));
    }
}
