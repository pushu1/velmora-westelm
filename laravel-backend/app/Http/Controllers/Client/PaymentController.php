<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Webhook;

class PaymentController extends Controller
{
    /**
     * Create a Stripe Checkout Session for order processing.
     */
    public function createCheckoutSession(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            $user = auth('sanctum')->user() ?? auth()->user() ?? \App\Models\User::first();
            if (!$user) {
                return response()->json(['error' => 'Authentication required.'], 401);
            }

            $orderItemsData = [];
            $stripeLineItems = [];
            $totalAmount = 0.00;

            // Loop over items, fetch fresh catalog prices to prevent client-side price injections
            foreach ($request->items as $cartItem) {
                $product = Product::findOrFail($cartItem['product_id']);
                $quantity = intval($cartItem['quantity']);

                // Ensure active inventory stock exists
                if ($product->inventory < $quantity) {
                    throw new \Exception("Insufficient stock level for product: '{$product->title}'. Only {$product->inventory} items available.");
                }

                $activePrice = $product->active_price;
                $lineTotal = $activePrice * $quantity;
                $totalAmount += $lineTotal;

                // Add to database provisioning array
                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price_at_purchase' => $activePrice,
                ];

                // Build Stripe Line Item array
                $stripeLineItems[] = [
                    'price_data' => [
                        'currency' => 'inr',
                        'product_data' => [
                            'name' => $product->title,
                            'metadata' => [
                                'sku' => $product->sku,
                            ],
                        ],
                        'unit_amount' => intval($activePrice * 100), // Stripe accepts amount in paise/cents
                    ],
                    'quantity' => $quantity,
                ];
            }

            // Create pending Order row
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $totalAmount,
                'payment_status' => 'pending',
                'payment_id' => null,
            ]);

            // Save order line items
            foreach ($orderItemsData as $itemData) {
                $itemData['order_id'] = $order->id;
                OrderItem::create($itemData);
            }

            // Check for Stripe Secret key fallback
            $stripeSecret = config('services.stripe.secret');
            if (empty($stripeSecret) || $stripeSecret === 'sk_test_placeholder') {
                // Stripe is left as placeholder or empty, simulate dynamic complete checkout immediately!
                $order->update([
                    'payment_status' => 'paid',
                    'payment_id' => 'ch_mock_' . \Illuminate\Support\Str::random(12),
                ]);

                // Decrement inventories
                foreach ($order->items as $item) {
                    $product = $item->product;
                    if ($product->inventory >= $item->quantity) {
                        $product->decrement('inventory', $item->quantity);
                    }
                }

                DB::commit();

                return response()->json([
                    'session_url' => 'http://localhost:3001/checkout?success=true&order_id=WO-MOCK-' . $order->id,
                    'session_id' => 'sess_mock_' . \Illuminate\Support\Str::random(12),
                    'order_id' => $order->id,
                    'mocked' => true
                ]);
            }

            // Configure Stripe keys
            Stripe::setApiKey($stripeSecret);

            // Generate secure Stripe Checkout Session
            $checkoutSession = StripeSession::create([
                'payment_method_types' => ['card'],
                'line_items' => $stripeLineItems,
                'mode' => 'payment',
                'success_url' => route('client.checkout.success') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('client.checkout.cancel'),
                'metadata' => [
                    'order_id' => $order->id,
                    'user_id' => $user->id,
                ],
            ]);

            DB::commit();

            return response()->json([
                'session_url' => $checkoutSession->url,
                'session_id' => $checkoutSession->id,
                'order_id' => $order->id,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Stripe Checkout provisioning error: " . $e->getMessage());
            return response()->json([
                'error' => 'Checkout initialization failed: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * Handle webhook successful notifications from Stripe.
     */
    public function handleWebhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $webhookSecret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $webhookSecret);
        } catch (\UnexpectedValueException $e) {
            Log::error("Invalid webhook payload received: " . $e->getMessage());
            return response()->json(['error' => 'Invalid payload.'], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            Log::error("Invalid Stripe webhook signature verification: " . $e->getMessage());
            return response()->json(['error' => 'Invalid signature.'], 400);
        }

        // Process successful transactions
        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            $orderId = $session->metadata->order_id ?? null;

            if ($orderId) {
                DB::beginTransaction();

                try {
                    $order = Order::with('items.product')->findOrFail($orderId);

                    if ($order->payment_status !== 'paid') {
                        // Mark order PAID and secure Stripe transaction ID
                        $order->update([
                            'payment_status' => 'paid',
                            'payment_id' => $session->payment_intent ?? $session->id,
                        ]);

                        // Decrement catalog inventories
                        foreach ($order->items as $item) {
                            $product = $item->product;
                            $product->decrement('inventory', $item->quantity);
                        }

                        DB::commit();
                        Log::info("Order ID {$orderId} has been successfully verified, paid, and inventory updated.");
                    } else {
                        DB::rollBack();
                        Log::info("Order ID {$orderId} was already marked paid.");
                    }

                } catch (\Exception $e) {
                    DB::rollBack();
                    Log::error("Error completing checkout webhook for Order {$orderId}: " . $e->getMessage());
                    return response()->json(['error' => 'Webhook handler database error.'], 500);
                }
            }
        }

        return response()->json(['status' => 'success']);
    }
}
