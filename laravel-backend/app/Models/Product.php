<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'short_description',
        'long_description',
        'dimensions',
        'care_instructions',
        'base_price',
        'discount_price',
        'sku',
        'inventory',
        'meta_title',
        'meta_description',
    ];

    /**
     * Boot the model.
     * Auto-generate clean slugs from title on saving.
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->title);
            }
        });
    }

    /**
     * Get the category that classifies this product.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get images for the product.
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order', 'asc');
    }

    /**
     * Get the active operational price (returns discount_price if set, else base_price).
     */
    public function getActivePriceAttribute(): float
    {
        return $this->discount_price !== null ? (float) $this->discount_price : (float) $this->base_price;
    }

    /**
     * Check if the product has a valid markdown markdown.
     */
    public function hasDiscount(): bool
    {
        return $this->discount_price !== null && $this->discount_price < $this->base_price;
    }

    /**
     * Calculate discount percentage representation.
     */
    public function getDiscountPercentageAttribute(): int
    {
        if (!$this->hasDiscount()) {
            return 0;
        }
        $saving = $this->base_price - $this->discount_price;
        return (int) round(($saving / $this->base_price) * 100);
    }
}
