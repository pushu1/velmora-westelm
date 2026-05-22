<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_amount',
        'payment_status',
        'payment_id',
    ];

    protected $casts = [
        'total_amount' => 'float',
    ];

    /**
     * Get the buying customer profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get detailed transaction items.
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
