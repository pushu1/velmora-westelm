'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { useStore } from '@/lib/store';
import { MockProduct } from '@/lib/db';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCardProps {
  product: MockProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist, addToCart, setCartOpen } = useStore();
  
  // Set default selected variant to the first one
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [hovered, setHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const activeImage = selectedVariant?.imageUrls[hovered ? (selectedVariant.imageUrls[1] ? 1 : 0) : 0];
  const isWishlisted = isInWishlist(product.id);

  const price = product.discountPrice ?? product.basePrice;
  const originalPrice = product.basePrice;
  const hasDiscount = product.discountPrice !== null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add to Zustand cart
    const productWithoutVariants = {
      id: product.id,
      title: product.title,
      slug: product.slug,
      description: product.description,
      basePrice: product.basePrice,
      discountPrice: product.discountPrice,
      inventoryCount: product.inventoryCount,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
    };
    
    addToCart(productWithoutVariants, selectedVariant, 1);
    
    // Show visual confirmation on the button
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);

    // Open Cart Drawer automatically
    setTimeout(() => {
      setCartOpen(true);
    }, 300);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productWithoutVariants = {
      id: product.id,
      title: product.title,
      slug: product.slug,
      description: product.description,
      basePrice: product.basePrice,
      discountPrice: product.discountPrice,
      inventoryCount: product.inventoryCount,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
    };
    toggleWishlist(productWithoutVariants);
  };

  return (
    <div
      className="group relative flex flex-col w-full h-full bg-white select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Product Image Area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-sand">
        {/* Wishlist Indicator Badge */}
        <button
          onClick={handleWishlistClick}
          className="absolute right-3 top-3 p-2 rounded-full bg-white/95 shadow-sm hover:bg-white z-20 text-brand-charcoal transition-all duration-300 transform hover:scale-105 cursor-pointer"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-300 ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-brand-charcoal hover:text-red-500'
            }`}
          />
        </button>

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute left-3 top-3 bg-brand-clay text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1 z-10">
            Sale
          </div>
        )}

        {/* Main Product Image with Zoom & Hover Swap */}
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <div className="relative w-full h-full">
            <Image
              src={activeImage || ''}
              alt={product.title}
              fill
              sizes="(max-w-7xl) 25vw, 300px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
              fetchPriority="low"
            />
          </div>
        </Link>

        {/* Quick Add Button overlay - slides up on hover */}
        <div className="absolute bottom-0 inset-x-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20 hidden md:block">
          <button
            onClick={handleQuickAdd}
            disabled={selectedVariant.stock <= 0}
            className={`w-full py-3 text-[10px] font-bold tracking-widest uppercase transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 cursor-pointer ${
              selectedVariant.stock <= 0
                ? 'bg-brand-grey text-brand-grey-dark cursor-not-allowed'
                : isAdded
                ? 'bg-green-600 text-white'
                : 'bg-brand-charcoal text-white hover:bg-brand-clay'
            }`}
          >
            {selectedVariant.stock <= 0 ? (
              <span>Out of Stock</span>
            ) : isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile Quick Add (always visible bottom overlay on mobile viewports) */}
        <div className="absolute bottom-2 right-2 md:hidden z-20">
          <button
            onClick={handleQuickAdd}
            disabled={selectedVariant.stock <= 0}
            className={`p-2.5 rounded-full shadow-md flex items-center justify-center cursor-pointer ${
              selectedVariant.stock <= 0
                ? 'bg-brand-grey text-brand-grey-dark'
                : isAdded
                ? 'bg-green-600 text-white'
                : 'bg-brand-charcoal text-white'
            }`}
            aria-label="Quick Add to Bag"
          >
            {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="pt-4 pb-2 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-display font-medium text-xs md:text-sm text-brand-charcoal tracking-wide leading-snug">
          <Link href={`/product/${product.slug}`} className="hover:text-brand-clay transition-colors duration-200">
            {product.title}
          </Link>
        </h3>

        {/* Category & Variant Count info */}
        <div className="flex justify-between items-center mt-1">
          <span className="text-[10px] text-brand-grey-dark uppercase tracking-wider">
            {product.categoryName}
          </span>
          {product.variants.length > 1 && (
            <span className="text-[9px] font-semibold text-brand-grey-dark uppercase tracking-widest font-mono">
              {product.variants.length} finishes
            </span>
          )}
        </div>

        {/* Pricing tags */}
        <div className="flex items-baseline space-x-2 mt-1.5 font-mono text-xs md:text-sm">
          {hasDiscount ? (
            <>
              <span className="font-semibold text-brand-clay">
                ₹{price.toLocaleString('en-IN')}
              </span>
              <span className="line-through text-[10px] md:text-xs text-brand-grey-dark">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            </>
          ) : (
            <span className="font-semibold text-brand-charcoal">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Swatch Selector Circles */}
        {product.variants.length > 1 && (
          <div className="flex items-center space-x-1.5 mt-3">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  selectedVariant.id === v.id
                    ? 'border-brand-charcoal scale-110 shadow-sm'
                    : 'border-brand-grey/50 hover:border-brand-grey'
                }`}
                title={v.colorName}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: v.colorHex }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
