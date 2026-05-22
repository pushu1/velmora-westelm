'use client';

import React, { useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Plus, Minus, Check, ChevronDown, Shield, Truck, RotateCcw, Share2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { MockProduct, MockVariant } from '@/lib/db';
import ProductCard from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductDetailsProps {
  product: MockProduct;
  relatedProducts: MockProduct[];
}

export default function ProductDetails({ product, relatedProducts }: ProductDetailsProps) {
  const { addToCart, toggleWishlist, isInWishlist, setCartOpen } = useStore();

  // Selected variant state
  const [selectedVariant, setSelectedVariant] = useState<MockVariant>(product.variants[0]);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Accordion active keys
  const [openAccordions, setOpenAccordions] = useState<string[]>(['desc']);

  // Zoom magnifier position
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const zoomImageRef = useRef<HTMLDivElement>(null);

  const isWishlisted = isInWishlist(product.id);
  
  const finalPrice = product.discountPrice ?? product.basePrice;
  const originalPrice = product.basePrice;
  const hasDiscount = product.discountPrice !== null;

  // Handle swatches click - update active variant and reset active image index
  const handleVariantChange = (variant: MockVariant) => {
    setSelectedVariant(variant);
    setActiveImageIdx(0);
  };

  // Add to Bag action
  const handleAddToBag = () => {
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
    
    addToCart(productWithoutVariants, selectedVariant, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    
    // Slide cart drawer out automatically after a brief delay
    setTimeout(() => {
      setCartOpen(true);
    }, 450);
  };

  // Wishlist toggle action
  const handleWishlistToggle = () => {
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

  // Toggle Accordion Panels
  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Lens Zoom coordinate logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomImageRef.current) return;
    const { left, top, width, height } = zoomImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // Generate specialized mock specs based on Category
  const specs = useMemo(() => {
    const cat = product.categoryName.toLowerCase();
    if (cat === 'furniture') {
      return {
        dimensions: '88"W x 40"D x 33"H. Cushion thickness: 8". Seat height: 18".',
        materials: 'Kiln-dried FSC®-certified hardwood frame. Steel sinuous spring supports. Aniline dyed full-grain leather or high-density velvet pile.',
        details: 'Hand-assembled double-dowel joinery with reinforced corner blocks. Seat cushions are filled with polyurethane foam core wrapped in feather-down blend.',
        care: 'Dust frequently with a clean, dry lint-free cloth. Blot spills immediately with a clean, dry towel. Keep out of direct sunlight.'
      };
    } else if (cat === 'bedding') {
      return {
        dimensions: 'Queen Duvet: 88"W x 92"L. King Duvet: 108"W x 92"L. Fits standard inserts.',
        materials: '100% certified organic Belgian flax. Loomed from French long-staple flax yarns. Hypoallergenic shell.',
        details: 'Pre-washed for unmatched initial softness. Features interior corner ties to lock inserts in place. Hidden button closure.',
        care: 'Machine wash warm on gentle cycle. Tumble dry low. Use mild chemical detergents. Naturally soft, linen looks best with organic wrinkles.'
      };
    } else if (cat === 'bath') {
      return {
        dimensions: 'Bath Sheets: 40"W x 70"L. Bath Towels: 30"W x 56"L. Towel Set includes 2 sheets & 2 hand towels.',
        materials: '100% long-staple certified organic cotton. 650 GSM structural thickness. Zero-twist weaving.',
        details: 'Features a clean modern ribbed accent border. Highly absorbent, extremely quick-drying, and luxuriously thick.',
        care: 'Machine wash cold. Avoid bleach and industrial softeners which coat fibers and reduce absorbency. Shake before drying.'
      };
    } else {
      return {
        dimensions: 'Sofa: 78"W x 36"D x 30"H. Dining Table: 72"W x 38"D x 30"H. Planters: 18" Diameter x 24"H.',
        materials: 'FSC®-certified solid teak wood or lightweight fiber-reinforced concrete. Rust-proof powder coated iron brackets. Grade 5 Sunbrella fabric cushions.',
        details: 'Naturally weather-proof and moisture-resistant teak ages to a beautiful warm silver-gray patina. Planters feature drain holes.',
        care: 'Wash regularly with mild dish soap and warm water. Cover or store in protected sheds during severe monsoon months to prevent teak discoloration.'
      };
    }
  }, [product.categoryName]);

  const activeImage = selectedVariant.imageUrls[activeImageIdx] || product.variants[0]?.imageUrls[0];

  return (
    <div className="bg-white select-none">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        <nav className="text-[10px] uppercase tracking-widest font-semibold text-brand-grey-dark flex items-center space-x-2">
          <Link href="/" className="hover:text-brand-charcoal transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/category/${product.categoryName.toLowerCase()}`} className="hover:text-brand-charcoal transition-colors">
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-brand-charcoal truncate max-w-[200px]">{product.title}</span>
        </nav>
      </div>

      {/* Main Product Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
        
        {/* Left Section: Gallery Viewport (Columns 1-7) */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
          
          {/* Vertical Sidebar Thumbnails (Desktop) */}
          <div className="hidden md:flex flex-col space-y-3.5 flex-shrink-0 w-20">
            {selectedVariant.imageUrls.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative aspect-[3/4] w-full overflow-hidden bg-brand-sand border flex-shrink-0 cursor-pointer ${
                  activeImageIdx === idx
                    ? 'border-brand-charcoal shadow-sm'
                    : 'border-brand-grey/50 hover:border-brand-grey'
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.title} Thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Large Main Viewport Image with Magnifier Lens */}
          <div className="flex-1 relative aspect-[3/4] w-full overflow-hidden bg-brand-sand border border-brand-sand">
            {/* Discount Badge */}
            {hasDiscount && (
              <div className="absolute left-4 top-4 bg-brand-clay text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 z-10">
                Sale
              </div>
            )}

            {/* Magnifier zoom viewport */}
            <div
              ref={zoomImageRef}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
              className="relative w-full h-full cursor-zoom-in"
            >
              <Image
                src={activeImage}
                alt={product.title}
                fill
                sizes="(max-w-7xl) 50vw, 800px"
                className="object-cover"
                priority
              />

              {/* Magnifier lens preview frame */}
              <AnimatePresence>
                {isZooming && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 z-10 pointer-events-none border border-brand-grey shadow-inner"
                    style={{
                      backgroundImage: `url(${activeImage})`,
                      backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                      backgroundSize: '200%',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Horizontal Swiper Carousel indicator (Mobile) */}
          <div className="flex md:hidden space-x-2.5 overflow-x-auto pb-1 select-none">
            {selectedVariant.imageUrls.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative aspect-[3/4] w-14 overflow-hidden bg-brand-sand border flex-shrink-0 cursor-pointer ${
                  activeImageIdx === idx ? 'border-brand-charcoal' : 'border-brand-grey/50'
                }`}
              >
                <Image
                  src={img}
                  alt="mobile thumb"
                  fill
                  sizes="60px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

        </div>

        {/* Right Section: Details Panel (Columns 8-12) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 h-fit">
          
          {/* Headline & Category */}
          <div className="space-y-1">
            <span className="text-[10px] text-brand-clay uppercase tracking-[0.2em] font-bold">
              {product.categoryName} Collection
            </span>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-brand-charcoal tracking-wide uppercase leading-tight">
              {product.title}
            </h1>
            <p className="text-xs text-brand-grey-dark leading-relaxed font-normal">
              FSC®-Certified Wood & Premium Organic Sustainable Upholsteries
            </p>
          </div>

          {/* Pricing mono layout */}
          <div className="flex items-baseline space-x-3.5 pb-4 border-b border-brand-sand">
            {hasDiscount ? (
              <>
                <span className="font-mono font-bold text-2xl text-brand-clay">
                  ₹{finalPrice.toLocaleString('en-IN')}
                </span>
                <span className="font-mono line-through text-sm text-brand-grey-dark">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-bold tracking-widest text-brand-clay bg-brand-clay/10 px-2 py-0.5 uppercase">
                  Save ₹{(originalPrice - finalPrice).toLocaleString('en-IN')}
                </span>
              </>
            ) : (
              <span className="font-mono font-bold text-2xl text-brand-charcoal">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Swatches finishes row */}
          {product.variants.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold text-brand-charcoal">
                <span className="font-display uppercase tracking-wider">Finish / Upholstery</span>
                <span className="text-brand-grey-dark uppercase tracking-wider">{selectedVariant.colorName}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleVariantChange(v)}
                    className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      selectedVariant.id === v.id
                        ? 'border-brand-charcoal scale-105 shadow-sm'
                        : 'border-brand-grey/50 hover:border-brand-grey'
                    }`}
                    title={v.colorName}
                  >
                    <span
                      className="w-7 h-7 rounded-full"
                      style={{ backgroundColor: v.colorHex }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SKU & Stock alert indicator */}
          <div className="space-y-1 text-xs">
            <div className="text-brand-grey-dark font-normal">
              SKU: <span className="font-semibold text-brand-charcoal">{selectedVariant.sku}</span>
            </div>
            
            {/* Dynamic low stock warning */}
            {selectedVariant.stock > 0 ? (
              selectedVariant.stock <= 5 ? (
                <p className="text-brand-clay font-bold uppercase tracking-wider text-[10px]">
                  ⚠️ Limited availability: Only {selectedVariant.stock} left in stock - order soon!
                </p>
              ) : (
                <p className="text-green-600 font-semibold text-[10px] uppercase tracking-wider">
                  ✓ In Stock - Ready to ship from flagship warehouse
                </p>
              )
            ) : (
              <p className="text-brand-grey-dark font-semibold text-[10px] uppercase tracking-wider">
                ✗ Temporarily Out of Stock
              </p>
            )}
          </div>

          {/* Quantity and Actions row */}
          <div className="flex items-center space-x-4 pt-2">
            {/* Quantity Selector box */}
            <div className="flex items-center border border-brand-grey h-12 bg-white">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3.5 h-full text-brand-charcoal hover:bg-brand-sand transition-colors cursor-pointer"
                disabled={quantity <= 1 || selectedVariant.stock <= 0}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-5 text-sm font-bold text-brand-charcoal select-none">
                {selectedVariant.stock <= 0 ? 0 : quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3.5 h-full text-brand-charcoal hover:bg-brand-sand transition-colors cursor-pointer"
                disabled={selectedVariant.stock <= 0}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Large full-width checkout bag button */}
            <button
              onClick={handleAddToBag}
              disabled={selectedVariant.stock <= 0}
              className={`flex-1 h-12 text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer ${
                selectedVariant.stock <= 0
                  ? 'bg-brand-grey text-brand-grey-dark cursor-not-allowed'
                  : isAdded
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-brand-charcoal text-white hover:bg-brand-clay shadow-md'
              }`}
            >
              {selectedVariant.stock <= 0 ? (
                <span>Sold Out</span>
              ) : isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Bag</span>
                </>
              )}
            </button>

            {/* Wishlist toggle side-button */}
            <button
              onClick={handleWishlistToggle}
              className={`h-12 w-12 border flex items-center justify-center transition-all duration-300 transform hover:scale-103 cursor-pointer ${
                isWishlisted
                  ? 'border-red-500 bg-red-50 text-red-500 hover:bg-red-100'
                  : 'border-brand-grey hover:border-brand-charcoal bg-white'
              }`}
              aria-label="Toggle Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : 'text-brand-charcoal'}`} />
            </button>
          </div>

          {/* Quick value trust elements */}
          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-brand-sand">
            <div className="flex flex-col items-center text-center p-2.5 bg-brand-sand/50">
              <Shield className="w-4 h-4 text-brand-clay mb-1" />
              <span className="text-[9px] font-bold text-brand-charcoal uppercase tracking-wider">10-Year Warranty</span>
            </div>
            <div className="flex flex-col items-center text-center p-2.5 bg-brand-sand/50">
              <Truck className="w-4 h-4 text-brand-clay mb-1" />
              <span className="text-[9px] font-bold text-brand-charcoal uppercase tracking-wider">Safe Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center p-2.5 bg-brand-sand/50">
              <RotateCcw className="w-4 h-4 text-brand-clay mb-1" />
              <span className="text-[9px] font-bold text-brand-charcoal uppercase tracking-wider">14-Day Exchange</span>
            </div>
          </div>

          {/* Accordions details panel */}
          <div className="border-t border-brand-grey pt-6 space-y-4">
            
            {/* Description panel */}
            <div className="border-b border-brand-sand pb-4">
              <button
                onClick={() => toggleAccordion('desc')}
                className="w-full flex items-center justify-between text-left font-display font-semibold text-xs tracking-wider uppercase text-brand-charcoal cursor-pointer"
              >
                <span>Description & Story</span>
                <ChevronDown
                  className={`w-4 h-4 text-brand-grey-dark transition-transform duration-300 ${
                    openAccordions.includes('desc') ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openAccordions.includes('desc') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-brand-grey-dark leading-relaxed font-normal pt-3">
                      {product.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Specifications panel */}
            <div className="border-b border-brand-sand pb-4">
              <button
                onClick={() => toggleAccordion('specs')}
                className="w-full flex items-center justify-between text-left font-display font-semibold text-xs tracking-wider uppercase text-brand-charcoal cursor-pointer"
              >
                <span>Dimensions & Details</span>
                <ChevronDown
                  className={`w-4 h-4 text-brand-grey-dark transition-transform duration-300 ${
                    openAccordions.includes('specs') ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openAccordions.includes('specs') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 space-y-2.5 text-xs font-normal text-brand-grey-dark">
                      <p>
                        <span className="font-semibold text-brand-charcoal uppercase tracking-wider text-[10px]">Dimensions: </span>
                        {specs.dimensions}
                      </p>
                      <p>
                        <span className="font-semibold text-brand-charcoal uppercase tracking-wider text-[10px]">Premium Materials: </span>
                        {specs.materials}
                      </p>
                      <p>
                        <span className="font-semibold text-brand-charcoal uppercase tracking-wider text-[10px]">Artisan Details: </span>
                        {specs.details}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Care panel */}
            <div className="border-b border-brand-sand pb-4">
              <button
                onClick={() => toggleAccordion('care')}
                className="w-full flex items-center justify-between text-left font-display font-semibold text-xs tracking-wider uppercase text-brand-charcoal cursor-pointer"
              >
                <span>Care Instructions</span>
                <ChevronDown
                  className={`w-4 h-4 text-brand-grey-dark transition-transform duration-300 ${
                    openAccordions.includes('care') ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openAccordions.includes('care') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-brand-grey-dark leading-relaxed font-normal pt-3">
                      {specs.care}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 border-t border-brand-grey mt-10">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="font-display font-semibold text-[10px] tracking-[0.25em] uppercase text-brand-clay">
              Signature Collection Match
            </span>
            <h2 className="font-display font-semibold text-2xl md:text-3xl tracking-wide text-brand-charcoal uppercase">
              Style It With
            </h2>
            <p className="text-xs md:text-sm text-brand-grey-dark leading-relaxed">
              Curate a harmonious look. Hand-selected companion designs that complement the structural profile and aesthetics.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
