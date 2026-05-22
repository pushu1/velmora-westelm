<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price_at_purchase',
    ];

    protected $casts = [
        'price_at_purchase' => 'float',
        'quantity' => 'integer',
    ];

    /**
     * Get parent transaction order.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get product references.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
