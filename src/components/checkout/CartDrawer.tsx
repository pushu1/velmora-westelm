'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function CartDrawer() {
  const { cart, isCartOpen, setCartOpen, updateQuantity, removeFromCart } = useStore();

  const subtotal = cart.reduce((total, item) => {
    const price = item.product.discountPrice ?? item.product.basePrice;
    return total + price * item.quantity;
  }, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckoutClick = () => {
    setCartOpen(false);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md bg-white z-50 flex flex-col shadow-2xl border-l border-brand-grey"
          >
            {/* Header */}
            <div className="p-5 border-b border-brand-grey flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <ShoppingBag className="w-5 h-5 text-brand-charcoal" />
                <span className="font-display font-semibold text-base tracking-wider uppercase text-brand-charcoal">
                  Shopping Bag ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1.5 hover:bg-brand-sand rounded-full transition-all duration-200 text-brand-grey-dark hover:text-black cursor-pointer"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <ShoppingBag className="w-12 h-12 text-brand-grey-dark mb-4 stroke-[1.25]" />
                  <h3 className="font-display font-semibold text-base tracking-wider uppercase text-brand-charcoal mb-2">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-brand-grey-dark max-w-[260px] leading-relaxed mb-6">
                    Sign in to sync your items or browse our curated signature design collections.
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="w-full max-w-[200px] py-3 bg-brand-charcoal text-white text-xs font-semibold uppercase tracking-widest hover:bg-brand-clay transition-all duration-300 cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const price = item.product.discountPrice ?? item.product.basePrice;
                  const originalPrice = item.product.basePrice;
                  const hasDiscount = item.product.discountPrice !== null;

                  return (
                    <motion.div
                      key={item.variant.sku}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex space-x-4 border-b border-brand-sand pb-4 last:border-b-0 last:pb-0"
                    >
                      {/* Product Thumbnail */}
                      <div className="relative aspect-[3/4] w-20 overflow-hidden bg-brand-sand border border-brand-sand">
                        <Image
                          src={item.variant.imageUrls[0] || (item.product as any).variants?.[0]?.imageUrls[0]}
                          alt={item.product.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                          priority={false}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between py-0.5">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-display font-medium text-xs text-brand-charcoal tracking-wide leading-snug">
                              <Link
                                href={`/product/${item.product.slug}`}
                                onClick={() => setCartOpen(false)}
                                className="hover:text-brand-clay transition-colors duration-200"
                              >
                                {item.product.title}
                              </Link>
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.variant.sku)}
                              className="text-brand-grey-dark hover:text-red-600 transition-colors p-1 cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[10px] text-brand-grey-dark uppercase tracking-wider font-semibold mt-1">
                            Color: {item.variant.colorName}
                          </p>
                          <p className="text-[10px] text-brand-grey-dark tracking-wider mt-0.5 font-mono">
                            SKU: {item.variant.sku}
                          </p>
                        </div>

                        <div className="flex justify-between items-end mt-2">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-brand-grey">
                            <button
                              onClick={() => updateQuantity(item.variant.sku, item.quantity - 1)}
                              className="px-2 py-1 text-brand-charcoal hover:bg-brand-sand transition-all duration-200 disabled:opacity-50 cursor-pointer"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-semibold text-brand-charcoal select-none">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.variant.sku, item.quantity + 1)}
                              className="px-2 py-1 text-brand-charcoal hover:bg-brand-sand transition-all duration-200 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price Tag */}
                          <div className="text-right">
                            {hasDiscount && (
                              <p className="text-[10px] line-through text-brand-grey-dark">
                                {formatPrice(originalPrice * item.quantity)}
                              </p>
                            )}
                            <p className="text-xs font-semibold text-brand-charcoal font-mono">
                              {formatPrice(price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer Summary (Sticky at bottom) */}
            {cart.length > 0 && (
              <div className="border-t border-brand-grey p-5 bg-brand-sand">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs text-brand-grey-dark">
                    <span>Subtotal</span>
                    <span className="font-mono">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-brand-grey-dark">
                    <span>Estimated Shipping</span>
                    <span className="text-brand-clay font-medium uppercase tracking-wider">
                      {subtotal > 49999 ? 'FREE' : '₹999'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-brand-grey-dark">
                    <span>GST (Included)</span>
                    <span className="font-mono">{formatPrice(subtotal * 0.18)}</span>
                  </div>
                  <div className="border-t border-brand-grey/50 pt-2 flex justify-between text-sm font-semibold text-brand-charcoal">
                    <span className="font-display uppercase tracking-widest">Total</span>
                    <span className="font-mono">{formatPrice(subtotal + (subtotal > 49999 ? 0 : 999))}</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Link
                    href="/checkout"
                    onClick={handleCheckoutClick}
                    className="w-full flex items-center justify-center space-x-2 py-3.5 bg-brand-charcoal text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-clay transition-all duration-300 shadow-md group"
                  >
                    <span>Proceed To Checkout</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>

                  <button
                    onClick={() => setCartOpen(false)}
                    className="w-full text-center py-2.5 text-[10px] font-bold tracking-widest uppercase text-brand-grey-dark hover:text-black transition-colors duration-200 cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Free Shipping Progress Indicator */}
                {subtotal < 49999 && (
                  <div className="mt-4 pt-3 border-t border-brand-grey/30">
                    <p className="text-[10px] text-brand-grey-dark leading-relaxed">
                      Add <span className="font-semibold text-brand-charcoal font-mono">{formatPrice(49999 - subtotal)}</span> more to unlock <span className="font-semibold text-brand-clay uppercase tracking-wider">FREE SHIPPING</span>
                    </p>
                    <div className="w-full h-1 bg-brand-grey mt-1.5 overflow-hidden rounded-full">
                      <div
                        className="h-full bg-brand-clay transition-all duration-500"
                        style={{ width: `${Math.min((subtotal / 49999) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
