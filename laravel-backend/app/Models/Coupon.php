<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'type',
        'value',
        'expiry_date',
        'is_active',
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'is_active' => 'boolean',
        'value' => 'float',
    ];

    /**
     * Check if the promo code is currently valid.
     */
    public function isValid(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        return $this->expiry_date->isFuture() || $this->expiry_date->isToday();
    }

    /**
     * Compute discount reduction for a cart total.
     */
    public function calculateDiscount(float $total): float
    {
        if (!$this->isValid()) {
            return 0.00;
        }

        if ($this->type === 'percentage') {
            return round(($total * ($this->value / 100)), 2);
        }

        // Fixed discount cannot exceed cart total
        return min($this->value, $total);
    }
}
