'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, setCartOpen } = useStore();

  const handleMoveToCart = (item: any) => {
    // If product has variants, add the first variant
    if (item.variants && item.variants.length > 0) {
      addToCart(item, item.variants[0], 1);
    } else {
      // In case we only stored a flat product object, construct a mock default variant
      const defaultVariant = {
        id: `var-${item.id}-default`,
        productId: item.id,
        colorName: 'Standard',
        colorHex: '#cccccc',
        sku: `WE-WISHLIST-${item.id}`,
        stock: 5,
        imageUrls: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80']
      };
      addToCart(item, defaultVariant, 1);
    }
    
    // Remove from wishlist
    toggleWishlist(item);
    
    // Open Cart Drawer
    setTimeout(() => {
      setCartOpen(true);
    }, 300);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white select-none">
      {/* Sticky Main Navigation */}
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-12 w-full">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="font-display font-semibold text-[10px] tracking-[0.25em] uppercase text-brand-clay">
            Personal Collection
          </span>
          <h1 className="font-display font-bold text-2xl md:text-3xl tracking-wide text-brand-charcoal uppercase">
            My Wishlist ({wishlist.length})
          </h1>
          <p className="text-xs text-brand-grey-dark leading-relaxed">
            Keep track of your favorite signature designs. Move them to your bag anytime to curated living.
          </p>
        </div>

        <AnimatePresence mode="popLayout">
          {wishlist.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center max-w-md mx-auto space-y-4"
            >
              <Heart className="w-12 h-12 text-brand-grey-dark mx-auto stroke-[1.25]" />
              <h3 className="font-display font-semibold text-base tracking-wider uppercase text-brand-charcoal">
                Your wishlist is empty
              </h3>
              <p className="text-xs text-brand-grey-dark leading-relaxed font-normal">
                Browse our seasonal Lookbooks, color finishes, and organic textiles, then click the heart icon to save what you love.
              </p>
              <div className="pt-2">
                <Link
                  href="/category/all"
                  className="inline-flex items-center space-x-3 px-8 py-3.5 bg-brand-charcoal text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-clay transition-all duration-300 shadow-md group"
                >
                  <span>Start Exploring Collections</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {wishlist.map((item: any) => {
                const price = item.discountPrice ?? item.basePrice;
                const originalPrice = item.basePrice;
                const hasDiscount = item.discountPrice !== null;
                
                // Fallback thumbnail if product doesn't store imagery directly
                const imageSrc = item.variants?.[0]?.imageUrls?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col bg-white border border-brand-sand shadow-sm group"
                  >
                    {/* Image Box */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-brand-sand">
                      <button
                        onClick={() => toggleWishlist(item)}
                        className="absolute right-2.5 top-2.5 p-2 bg-white/95 hover:bg-white rounded-full text-brand-clay shadow-sm z-20 cursor-pointer"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <Link href={`/product/${item.slug}`} className="block w-full h-full">
                        <Image
                          src={imageSrc}
                          alt={item.title}
                          fill
                          sizes="(max-w-md) 100vw, 280px"
                          className="object-cover transition-transform duration-500 group-hover:scale-103"
                        />
                      </Link>

                      {/* Move to bag overlay button */}
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="absolute bottom-0 inset-x-0 py-3 bg-brand-charcoal text-white text-[10px] font-bold tracking-widest uppercase hover:bg-brand-clay transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center space-x-2 z-20 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
                      </button>
                    </div>

                    {/* Content Details */}
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="font-display font-medium text-xs md:text-sm text-brand-charcoal tracking-wide truncate">
                          <Link href={`/product/${item.slug}`} className="hover:text-brand-clay transition-colors duration-200">
                            {item.title}
                          </Link>
                        </h3>
                        <p className="text-[10px] text-brand-grey-dark uppercase tracking-wider mt-0.5">
                          {item.categoryName}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Price */}
                        <div className="flex items-baseline space-x-2 font-mono text-xs md:text-sm">
                          {hasDiscount ? (
                            <>
                              <span className="font-semibold text-brand-clay">
                                {formatPrice(price)}
                              </span>
                              <span className="line-through text-[10px] text-brand-grey-dark">
                                {formatPrice(originalPrice)}
                              </span>
                            </>
                          ) : (
                            <span className="font-semibold text-brand-charcoal">
                              {formatPrice(originalPrice)}
                            </span>
                          )}
                        </div>

                        {/* Mobile Move to Cart Trigger */}
                        <button
                          onClick={() => handleMoveToCart(item)}
                          className="md:hidden p-2 bg-brand-charcoal text-white rounded-full flex items-center justify-center cursor-pointer"
                          aria-label="Move to bag"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
