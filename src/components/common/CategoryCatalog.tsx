'use client';

import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ChevronDown, X, Grid, List, Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';
import { MockProduct } from '@/lib/db';
import { motion, AnimatePresence } from 'framer-motion';

interface CategoryCatalogProps {
  initialProducts: MockProduct[];
  categoryName: string;
  categoryDescription?: string;
  searchQuery?: string;
}

export default function CategoryCatalog({
  initialProducts,
  categoryName,
  categoryDescription,
  searchQuery,
}: CategoryCatalogProps) {
  // Filters state
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [hideOutOfStock, setHideOutOfStock] = useState(false);
  const [sortBy, setSortBy] = useState('bestseller');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Price brackets
  const priceBrackets = [
    { label: 'Under ₹5,000', id: 'under-5000', test: (p: number) => p < 5000 },
    { label: '₹5,000 - ₹20,000', id: '5000-20000', test: (p: number) => p >= 5000 && p <= 20000 },
    { label: '₹20,000 - ₹50,000', id: '20000-50000', test: (p: number) => p >= 20000 && p <= 50000 },
    { label: 'Over ₹50,000', id: 'over-50000', test: (p: number) => p > 50000 },
  ];

  // Extract unique colors from products catalog
  const availableColors = useMemo(() => {
    const colorMap = new Map<string, string>();
    initialProducts.forEach((p) => {
      p.variants.forEach((v) => {
        colorMap.set(v.colorName, v.colorHex);
      });
    });
    return Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));
  }, [initialProducts]);

  // Handle color selection toggle
  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedColors([]);
    setSelectedPriceRange(null);
    setHideOutOfStock(false);
  };

  // Filter and sort catalog products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Color filter
    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.variants.some((v) => selectedColors.includes(v.colorName))
      );
    }

    // 2. Price filter
    if (selectedPriceRange) {
      const activeBracket = priceBrackets.find((b) => b.id === selectedPriceRange);
      if (activeBracket) {
        result = result.filter((p) => {
          const finalPrice = p.discountPrice ?? p.basePrice;
          return activeBracket.test(finalPrice);
        });
      }
    }

    // 3. Stock availability filter
    if (hideOutOfStock) {
      result = result.filter((p) =>
        p.variants.some((v) => v.stock > 0)
      );
    }

    // 4. Sorting logic
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.discountPrice ?? a.basePrice) - (b.discountPrice ?? b.basePrice));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.discountPrice ?? b.basePrice) - (a.discountPrice ?? a.basePrice));
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'bestseller') {
      // Keep initial mock order
    }

    return result;
  }, [initialProducts, selectedColors, selectedPriceRange, hideOutOfStock, sortBy]);

  const activePriceLabel = priceBrackets.find((b) => b.id === selectedPriceRange)?.label;

  return (
    <div className="w-full bg-white select-none">
      
      {/* Dynamic Catalog Hero Header */}
      <div className="bg-brand-sand py-12 px-4 md:px-8 border-b border-brand-grey text-center space-y-3">
        <span className="font-display font-semibold text-[10px] tracking-[0.25em] uppercase text-brand-clay flex items-center justify-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Signature Collections</span>
        </span>
        <h1 className="font-display font-bold text-3xl md:text-5xl text-brand-charcoal uppercase tracking-wider">
          {searchQuery ? `Search Results for "${searchQuery}"` : categoryName}
        </h1>
        <p className="text-xs md:text-sm text-brand-grey-dark max-w-2xl mx-auto leading-relaxed font-normal">
          {categoryDescription ||
            `Discover our premium, FSC®-certified collection of sustainably sourced designs crafted to bring luxury and comfort into your life.`}
        </p>
      </div>

      {/* Catalog Grid layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filter Section (Desktop) */}
        <aside className="hidden lg:block space-y-8 flex-shrink-0">
          <div className="flex items-center justify-between border-b border-brand-grey pb-3">
            <h3 className="font-display font-semibold text-xs tracking-wider uppercase text-brand-charcoal flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </h3>
            {(selectedColors.length > 0 || selectedPriceRange || hideOutOfStock) && (
              <button
                onClick={clearFilters}
                className="text-[10px] font-bold tracking-wider text-brand-clay hover:underline uppercase cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Price Range Brackets */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-[11px] tracking-wider uppercase text-brand-charcoal">
              Price Range
            </h4>
            <div className="space-y-2">
              {priceBrackets.map((bracket) => (
                <label key={bracket.id} className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="price-bracket"
                    checked={selectedPriceRange === bracket.id}
                    onChange={() => setSelectedPriceRange(bracket.id)}
                    className="w-4 h-4 border-brand-grey text-brand-charcoal focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-brand-grey-dark hover:text-black transition-colors font-normal">
                    {bracket.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Fabric / Finish Colors */}
          {availableColors.length > 0 && (
            <div className="space-y-3.5 border-t border-brand-sand pt-6">
              <h4 className="font-display font-semibold text-[11px] tracking-wider uppercase text-brand-charcoal">
                Finishes / Colors
              </h4>
              <div className="grid grid-cols-5 gap-2.5">
                {availableColors.map((color) => {
                  const isChecked = selectedColors.includes(color.name);
                  return (
                    <button
                      key={color.name}
                      onClick={() => toggleColor(color.name)}
                      className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                        isChecked
                          ? 'border-brand-charcoal scale-105 shadow-sm'
                          : 'border-brand-grey/50 hover:border-brand-grey'
                      }`}
                      title={color.name}
                    >
                      <span
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: color.hex }}
                      />
                      {isChecked && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-brand-charcoal text-white rounded-full flex items-center justify-center text-[8px] font-bold border border-white">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Availability */}
          <div className="space-y-3.5 border-t border-brand-sand pt-6">
            <h4 className="font-display font-semibold text-[11px] tracking-wider uppercase text-brand-charcoal">
              Availability
            </h4>
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hideOutOfStock}
                onChange={(e) => setHideOutOfStock(e.target.checked)}
                className="w-4 h-4 border-brand-grey text-brand-charcoal focus:ring-0 cursor-pointer"
              />
              <span className="text-xs text-brand-grey-dark hover:text-black transition-colors font-normal">
                Hide Out of Stock
              </span>
            </label>
          </div>
        </aside>

        {/* Right Catalog View Section */}
        <section className="col-span-1 lg:col-span-3 space-y-6">
          {/* Controls top-bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-sand pb-4 gap-4">
            <div className="text-xs text-brand-grey-dark font-normal">
              Showing <span className="font-semibold text-brand-charcoal">{filteredProducts.length}</span> of{' '}
              <span className="font-semibold text-brand-charcoal">{initialProducts.length}</span> items
            </div>

            <div className="flex items-center space-x-4">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden px-4 py-2 border border-brand-grey text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 hover:bg-brand-sand transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              {/* Sorting options */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-brand-grey-dark whitespace-nowrap font-normal">Sort By:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-brand-sand border border-brand-grey text-xs py-2 pl-3 pr-8 focus:outline-none focus:border-brand-charcoal tracking-wide cursor-pointer"
                  >
                    <option value="bestseller">Best Selling</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name-asc">Alphabetical: A-Z</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-brand-grey-dark absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Active pills tags */}
          {(selectedColors.length > 0 || selectedPriceRange || hideOutOfStock) && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[10px] text-brand-grey-dark uppercase tracking-widest font-semibold mr-1.5">
                Active Filters:
              </span>
              
              {selectedPriceRange && activePriceLabel && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-brand-sand border border-brand-grey text-xs text-brand-charcoal">
                  <span>{activePriceLabel}</span>
                  <button onClick={() => setSelectedPriceRange(null)} className="cursor-pointer">
                    <X className="w-3 h-3 text-brand-grey-dark hover:text-black" />
                  </button>
                </span>
              )}

              {selectedColors.map((color) => (
                <span
                  key={color}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 bg-brand-sand border border-brand-grey text-xs text-brand-charcoal"
                >
                  <span>{color}</span>
                  <button onClick={() => toggleColor(color)} className="cursor-pointer">
                    <X className="w-3 h-3 text-brand-grey-dark hover:text-black" />
                  </button>
                </span>
              ))}

              {hideOutOfStock && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-brand-sand border border-brand-grey text-xs text-brand-charcoal">
                  <span>In Stock Only</span>
                  <button onClick={() => setHideOutOfStock(false)} className="cursor-pointer">
                    <X className="w-3 h-3 text-brand-grey-dark hover:text-black" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Catalog grid */}
          <AnimatePresence mode="popLayout">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-20 text-center space-y-4"
              >
                <SlidersHorizontal className="w-12 h-12 text-brand-grey-dark mx-auto stroke-[1.25]" />
                <h3 className="font-display font-semibold text-base tracking-wider uppercase text-brand-charcoal">
                  No matching designs found
                </h3>
                <p className="text-xs text-brand-grey-dark max-w-sm mx-auto leading-relaxed font-normal">
                  Try broadening your price filters, selecting different color swatches, or clearing all constraints.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-brand-charcoal text-white text-xs font-semibold uppercase tracking-widest hover:bg-brand-clay transition-all duration-300 cursor-pointer"
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10"
              >
                {filteredProducts.map((prod) => (
                  <motion.div
                    key={prod.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={prod} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </div>

      {/* Slide-out Mobile Filters Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden cursor-pointer"
            />

            {/* Sidebar drawer panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:max-w-xs bg-white z-50 flex flex-col lg:hidden shadow-2xl"
            >
              {/* Header */}
              <div className="p-4 border-b border-brand-grey flex items-center justify-between bg-brand-sand">
                <span className="font-display font-semibold text-sm tracking-wider uppercase text-brand-charcoal">
                  Filter Catalog
                </span>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1.5 hover:bg-brand-sand rounded-full transition-colors cursor-pointer"
                  aria-label="Close filters drawer"
                >
                  <X className="w-5 h-5 text-brand-charcoal" />
                </button>
              </div>

              {/* Filters lists */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                
                {/* Price range */}
                <div className="space-y-3">
                  <h4 className="font-display font-semibold text-[11px] tracking-wider uppercase text-brand-charcoal">
                    Price Range
                  </h4>
                  <div className="space-y-2.5">
                    {priceBrackets.map((bracket) => (
                      <label key={bracket.id} className="flex items-center space-x-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="price-bracket-mobile"
                          checked={selectedPriceRange === bracket.id}
                          onChange={() => setSelectedPriceRange(bracket.id)}
                          className="w-4 h-4 border-brand-grey text-brand-charcoal focus:ring-0 cursor-pointer"
                        />
                        <span className="text-xs text-brand-grey-dark font-normal">
                          {bracket.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Finishes / Colors */}
                {availableColors.length > 0 && (
                  <div className="space-y-3 border-t border-brand-sand pt-5">
                    <h4 className="font-display font-semibold text-[11px] tracking-wider uppercase text-brand-charcoal">
                      Finishes / Colors
                    </h4>
                    <div className="grid grid-cols-4 gap-2.5">
                      {availableColors.map((color) => {
                        const isChecked = selectedColors.includes(color.name);
                        return (
                          <button
                            key={color.name}
                            onClick={() => toggleColor(color.name)}
                            className={`relative w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer ${
                              isChecked
                                ? 'border-brand-charcoal scale-105 shadow-sm'
                                : 'border-brand-grey/50'
                            }`}
                            title={color.name}
                          >
                            <span
                              className="w-5 h-5 rounded-full"
                              style={{ backgroundColor: color.hex }}
                            />
                            {isChecked && (
                              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-brand-charcoal text-white rounded-full flex items-center justify-center text-[8px] font-bold border border-white">
                                ✓
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Stock availability */}
                <div className="space-y-3 border-t border-brand-sand pt-5">
                  <h4 className="font-display font-semibold text-[11px] tracking-wider uppercase text-brand-charcoal">
                    Availability
                  </h4>
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hideOutOfStock}
                      onChange={(e) => setHideOutOfStock(e.target.checked)}
                      className="w-4 h-4 border-brand-grey text-brand-charcoal focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs text-brand-grey-dark font-normal">
                      Hide Out of Stock
                    </span>
                  </label>
                </div>

              </div>

              {/* Mobile Actions bottom bar */}
              <div className="p-4 bg-brand-sand border-t border-brand-grey flex space-x-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 border border-brand-charcoal text-xs font-semibold uppercase tracking-wider text-brand-charcoal hover:bg-brand-sand transition-all cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 py-3 bg-brand-charcoal text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-clay transition-all cursor-pointer"
                >
                  Apply
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
