'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, User, Heart, ShoppingBag, Menu, X, ArrowRight, Sparkles, LogOut, ShieldCheck, ChevronDown, UserCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { useStore } from '@/lib/store';
import AnnouncementBar from './AnnouncementBar';
import MegaMenu from './MegaMenu';
import CartDrawer from '../checkout/CartDrawer';
import { MockProduct } from '@/lib/db';
import { NAVIGATION_DATA } from '@/config/navigation';


const OFFLINE_FALLBACK_CATEGORIES = [
  {
    id: 'f1',
    name: 'Furniture',
    slug: 'furniture',
    children: [
      {
        id: 'f2_1',
        name: 'Living Room',
        slug: 'living-room',
        children: [
          { id: 'f3_1', name: 'Sofas & Sectionals', slug: 'sofas-sectionals' },
          { id: 'f3_2', name: 'Coffee Tables', slug: 'coffee-tables' },
          { id: 'f3_3', name: 'Accent Chairs', slug: 'accent-chairs' },
        ]
      },
      {
        id: 'f2_2',
        name: 'Dining Room',
        slug: 'dining-room',
        children: [
          { id: 'f3_4', name: 'Dining Tables', slug: 'dining-tables' },
          { id: 'f3_5', name: 'Dining Chairs', slug: 'dining-chairs' },
          { id: 'f3_6', name: 'Bar Stools', slug: 'bar-stools' },
        ]
      },
      {
        id: 'f2_3',
        name: 'Bedroom',
        slug: 'bedroom',
        children: [
          { id: 'f3_7', name: 'Beds & Headboards', slug: 'beds-headboards' },
          { id: 'f3_8', name: 'Nightstands', slug: 'nightstands' },
          { id: 'f3_9', name: 'Dressers & Chests', slug: 'dressers-chests' },
        ]
      }
    ]
  },
  {
    id: 'b1',
    name: 'Bedding',
    slug: 'bedding',
    children: [
      {
        id: 'b2_1',
        name: 'Sheets & Pillowcases',
        slug: 'sheets-pillowcases',
        children: [
          { id: 'b3_1', name: 'Linen Sheets', slug: 'linen-sheets' },
          { id: 'b3_2', name: 'Cotton Percale Sheets', slug: 'cotton-percale-sheets' },
          { id: 'b3_3', name: 'Sateen Sheets', slug: 'sateen-sheets' },
        ]
      },
      {
        id: 'b2_2',
        name: 'Duvet Covers & Quilts',
        slug: 'duvet-covers-quilts',
        children: [
          { id: 'b3_4', name: 'Duvet Covers', slug: 'duvet-covers' },
          { id: 'b3_5', name: 'Quilts & Blankets', slug: 'quilts-blankets' },
          { id: 'b3_6', name: 'Insert Fillers', slug: 'insert-fillers' },
        ]
      },
      {
        id: 'b2_3',
        name: 'Pillows & Protectors',
        slug: 'pillows-protectors',
        children: [
          { id: 'b3_7', name: 'Bed Pillows', slug: 'bed-pillows' },
          { id: 'b3_8', name: 'Mattress Protectors', slug: 'mattress-protectors' },
          { id: 'b3_9', name: 'Pillow Protectors', slug: 'pillow-protectors' },
        ]
      }
    ]
  },
  {
    id: 'ba1',
    name: 'Bath',
    slug: 'bath',
    children: [
      {
        id: 'ba2_1',
        name: 'Towels',
        slug: 'towels',
        children: [
          { id: 'ba3_1', name: 'Bath Towels', slug: 'bath-towels' },
          { id: 'ba3_2', name: 'Hand Towels', slug: 'hand-towels' },
          { id: 'ba3_3', name: 'Washcloths', slug: 'washcloths' },
        ]
      },
      {
        id: 'ba2_2',
        name: 'Bath Rugs & Mats',
        slug: 'bath-rugs-mats',
        children: [
          { id: 'ba3_4', name: 'Cotton Bath Rugs', slug: 'cotton-bath-rugs' },
          { id: 'ba3_5', name: 'Memory Foam Mats', slug: 'memory-foam-mats' },
        ]
      },
      {
        id: 'ba2_3',
        name: 'Spa Accessories',
        slug: 'spa-accessories',
        children: [
          { id: 'ba3_6', name: 'Shower Curtains', slug: 'shower-curtains' },
          { id: 'ba3_7', name: 'Soap Dispensers', slug: 'soap-dispensers' },
          { id: 'ba3_8', name: 'Toothbrush Holders', slug: 'toothbrush-holders' },
        ]
      }
    ]
  },
  {
    id: 'o1',
    name: 'Outdoor',
    slug: 'outdoor',
    children: [
      {
        id: 'o2_1',
        name: 'Outdoor Lounge',
        slug: 'outdoor-lounge',
        children: [
          { id: 'o3_1', name: 'Outdoor Sofas', slug: 'outdoor-sofas' },
          { id: 'o3_2', name: 'Outdoor Lounge Chairs', slug: 'outdoor-lounge-chairs' },
          { id: 'o3_3', name: 'Outdoor Coffee Tables', slug: 'outdoor-coffee-tables' },
        ]
      },
      {
        id: 'o2_2',
        name: 'Outdoor Dining',
        slug: 'outdoor-dining',
        children: [
          { id: 'o3_4', name: 'Outdoor Dining Tables', slug: 'outdoor-dining-tables' },
          { id: 'o3_5', name: 'Outdoor Dining Chairs', slug: 'outdoor-dining-chairs' },
        ]
      },
      {
        id: 'o2_3',
        name: 'Outdoor Accents',
        slug: 'outdoor-accents',
        children: [
          { id: 'o3_6', name: 'Outdoor Planters', slug: 'outdoor-planters' },
          { id: 'o3_7', name: 'Outdoor Rugs', slug: 'outdoor-rugs' },
          { id: 'o3_8', name: 'Outdoor Lighting', slug: 'outdoor-lighting' },
        ]
      }
    ]
  }
];


export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>(NAVIGATION_DATA);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MockProduct[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { cart, wishlist, setCartOpen } = useStore();
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  // Handle sticky scroll styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Handle outside click to close search suggestions and user dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Fetch search suggestions
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?query=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.slice(0, 5)); // Limit to 5 suggestions
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Delayed category hovering to make MegaMenu transition smooth
  const handleMouseEnter = (category: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveCategory(category);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 150);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/category/all?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
    }
  };

  return (
    <>
      {/* Full-width Screen Dim Backdrop Overlay */}
      <div
        onMouseEnter={handleMouseLeave}
        className={`fixed inset-0 bg-black/40 backdrop-blur-[1px] transition-all duration-300 z-30 cursor-pointer ${
          activeCategory
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Wrapper to hold top announcements and navbar */}
      <div className="w-full flex flex-col z-40 bg-white">
        {/* Carousel top announcements */}
        <AnnouncementBar />

        {/* Header content */}
        <header
          className={`w-full bg-white transition-all duration-300 ${
            isScrolled ? 'sticky top-0 z-40 shadow-sm' : ''
          }`}
        >
          {/* Row 1: Logo & Utility Actions (Top Row) */}
          <div className="border-b border-brand-grey bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
              
              {/* Left Zone: Hamburger (mobile) & Search bar (desktop) */}
              <div className="flex items-center justify-start flex-1 gap-2">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 hover:bg-brand-sand rounded-full md:hidden transition-colors cursor-pointer"
                  aria-label="Open navigation menu"
                >
                  <Menu className="w-5 h-5 text-brand-charcoal" />
                </button>

                {/* Auto-suggest Search bar container (desktop) */}
                <div ref={searchContainerRef} className="relative hidden md:block w-64 xl:w-80">
                  <form onSubmit={handleSearchSubmit}>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search signature designs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        className="w-full bg-brand-sand border border-brand-grey text-xs py-2 pl-3 pr-9 tracking-wide focus:outline-none focus:border-brand-charcoal focus:bg-white transition-all duration-300"
                      />
                      <button
                        type="submit"
                        className="absolute right-0.5 top-0.5 bottom-0.5 px-2.5 flex items-center justify-center hover:text-brand-clay text-brand-grey-dark transition-colors duration-200 cursor-pointer"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </form>

                  {/* Suggestions Dropdown box */}
                  <AnimatePresence>
                    {isSearchFocused && (searchQuery.trim() !== '' || searchResults.length > 0) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 bg-white border border-brand-grey shadow-xl z-50 mt-1 max-h-[380px] overflow-y-auto"
                      >
                        {searchResults.length === 0 ? (
                          <div className="p-5 text-center">
                            <p className="text-xs text-brand-grey-dark leading-relaxed">
                              No collections match "{searchQuery}"
                            </p>
                          </div>
                        ) : (
                          <div className="py-2.5 divide-y divide-brand-sand text-left">
                            <div className="px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase text-brand-clay flex items-center space-x-1.5">
                              <Sparkles className="w-3 h-3" />
                              <span>Suggested Items</span>
                            </div>
                            {searchResults.map((prod) => (
                              <Link
                                key={prod.id}
                                href={`/product/${prod.slug}`}
                                onClick={() => {
                                  setIsSearchFocused(false);
                                  setSearchQuery('');
                                }}
                                className="px-4 py-2.5 flex space-x-3 hover:bg-brand-sand transition-all duration-200"
                              >
                                <div className="relative aspect-[3/4] w-10 overflow-hidden bg-brand-sand border border-brand-grey">
                                  <Image
                                    src={prod.variants[0]?.imageUrls[0] || ''}
                                    alt={prod.title}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1 flex flex-col justify-center min-w-0">
                                  <span className="font-display font-semibold text-xs text-brand-charcoal truncate">
                                    {prod.title}
                                  </span>
                                  <span className="text-[10px] text-brand-grey-dark uppercase tracking-wider mt-0.5">
                                    {prod.categoryName}
                                  </span>
                                </div>
                                <div className="flex flex-col justify-center text-right font-mono font-semibold text-xs text-brand-charcoal">
                                  {prod.discountPrice ? (
                                    <>
                                      <span className="text-brand-clay">₹{prod.discountPrice.toLocaleString('en-IN')}</span>
                                      <span className="text-[10px] line-through text-brand-grey-dark">₹{prod.basePrice.toLocaleString('en-IN')}</span>
                                    </>
                                  ) : (
                                    <span>₹{prod.basePrice.toLocaleString('en-IN')}</span>
                                  )}
                                </div>
                              </Link>
                            ))}
                            <div className="p-2 px-4 bg-brand-sand text-center">
                              <button
                                onClick={handleSearchSubmit}
                                className="text-[10px] font-bold tracking-widest uppercase text-brand-charcoal hover:text-brand-clay transition-colors duration-200 cursor-pointer"
                              >
                                View All Search Results
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Search Button */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(true);
                  }}
                  className="p-2 hover:bg-brand-sand rounded-full md:hidden text-brand-charcoal transition-colors cursor-pointer"
                  aria-label="Search items"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Center Zone: Typographic Luxury Logo */}
              <div className="flex-shrink-0 text-center flex justify-center">
                <Link href="/" className="inline-block">
                  {/* <span className="font-display text-2xl md:text-3xl font-bold tracking-[0.35em] text-brand-charcoal uppercase select-none">
                    west elm
                  </span> */}
                  <img
  src="/valmoralivinglogo.png"
  alt="Valmora Living"
  className="h-14 w-auto object-contain"
/>
                </Link>
              </div>

              {/* Right Zone: Admin Link, Auth actions, Wishlist & Shopping bag */}
              <div className="flex items-center justify-end flex-1 space-x-1.5 md:space-x-4">
                
                {/* Admin Portal Global Banner Link */}
                {session?.user && (session?.user as any)?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="hidden lg:flex items-center space-x-1 px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-800 text-[10px] font-bold tracking-widest uppercase hover:bg-amber-100 transition-all rounded shadow-sm"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin Portal</span>
                  </Link>
                )}

                {/* Dynamic User Account indicator or Dropdown */}
                {!session ? (
                  <div className="hidden sm:flex items-center space-x-3.5 pr-1">
                    <Link
                      href="/login"
                      className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal hover:text-brand-clay transition-colors"
                    >
                      Sign In
                    </Link>
                    <span className="text-brand-grey text-sm">|</span>
                    <Link
                      href="/register"
                      className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal hover:text-brand-clay transition-colors"
                    >
                      Create Account
                    </Link>
                  </div>
                ) : (
                  <div ref={userDropdownRef} className="relative">
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="p-2 hover:bg-brand-sand rounded-full text-brand-charcoal transition-colors cursor-pointer flex items-center space-x-1"
                      aria-label="Toggle user options"
                    >
                      <User className="w-5 h-5" />
                      <ChevronDown className={`w-3.5 h-3.5 text-brand-grey-dark transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isUserDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-52 bg-white border border-brand-grey shadow-xl z-50 py-2 divide-y divide-brand-sand text-left"
                        >
                          <div className="px-4 py-2.5">
                            <p className="text-[10px] text-brand-grey-dark uppercase tracking-widest">Signed in as</p>
                            <p className="text-xs font-bold text-brand-charcoal truncate mt-0.5">{session?.user?.name || "Valued Customer"}</p>
                            <span className={`inline-block text-[8px] font-bold px-1.5 py-0.5 rounded mt-1.5 uppercase tracking-wider ${
                              (session?.user as any)?.role === 'ADMIN' ? 'bg-amber-100 text-amber-800' : 'bg-brand-sand text-brand-charcoal'
                            }`}>
                              {(session?.user as any)?.role === 'ADMIN' ? 'Admin Portal Manager' : 'Club Member'}
                            </span>
                          </div>

                          <div className="py-1">
                            {(session?.user as any)?.role === 'ADMIN' && (
                              <Link
                                href="/admin"
                                onClick={() => setIsUserDropdownOpen(false)}
                                className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-amber-800 hover:bg-amber-50 flex items-center space-x-2"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Admin Dashboard</span>
                              </Link>
                            )}
                            <Link
                              href="/login?tab=profile"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-brand-charcoal hover:bg-brand-sand flex items-center space-x-2"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>My Profile</span>
                            </Link>
                            <Link
                              href="/login?tab=orders"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-brand-charcoal hover:bg-brand-sand flex items-center space-x-2"
                            >
                              <Heart className="w-3.5 h-3.5" />
                              <span>Order History</span>
                            </Link>
                          </div>

                          <div className="py-1">
                            <button
                              onClick={() => {
                                setIsUserDropdownOpen(false);
                                signOut({ callbackUrl: '/' });
                              }}
                              className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-brand-clay hover:bg-brand-sand flex items-center space-x-2 cursor-pointer"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              <span>Logout</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {!session && (
                  <Link
                    href="/login"
                    className="sm:hidden p-2 hover:bg-brand-sand rounded-full text-brand-charcoal transition-colors cursor-pointer"
                    aria-label="User account login"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                )}

                {/* Wishlist Link */}
                <Link
                  href="/wishlist"
                  className="relative p-2 hover:bg-brand-sand rounded-full text-brand-charcoal transition-colors cursor-pointer"
                  aria-label="Wishlist items"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-brand-clay text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Shopping Bag Trigger */}
                <button
                  onClick={() => setCartOpen(true)}
                  className="relative p-2 hover:bg-brand-sand rounded-full text-brand-charcoal transition-colors cursor-pointer"
                  aria-label="Shopping bag"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-brand-charcoal text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {cartItemCount}
                    </span>
                  )}
                </button>

              </div>

            </div>
          </div>

          {/* Row 2: Navigation & Mega Menu (Bottom Row) */}
          <div className="border-b border-brand-grey bg-white hidden md:block relative">
            <div className="max-w-7xl mx-auto px-8 flex justify-center py-3">
              <nav className="flex items-center space-x-10">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onMouseEnter={() => handleMouseEnter(cat.name)}
                    onMouseLeave={handleMouseLeave}
                    className="relative py-1 group cursor-pointer"
                  >
                    <Link
                      href={cat.href || `/category/${cat.slug || cat.name.toLowerCase()}`}
                      className="font-display font-medium text-xs tracking-widest uppercase text-brand-charcoal hover:text-brand-clay transition-colors duration-200"
                    >
                      {cat.name}
                    </Link>
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-brand-charcoal scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                        activeCategory?.toLowerCase() === cat.name.toLowerCase() ? 'scale-x-100' : ''
                      }`}
                    />
                  </div>
                ))}
              </nav>
            </div>

            {/* Mount the elegant desktop MegaMenu directly under Row 2 */}
            <AnimatePresence>
              {activeCategory && (
                <div
                  onMouseEnter={() => {
                    if (hoverTimeoutRef.current) {
                      clearTimeout(hoverTimeoutRef.current);
                      hoverTimeoutRef.current = null;
                    }
                  }}
                  onMouseLeave={handleMouseLeave}
                >
                  <MegaMenu
                    activeCategoryName={activeCategory}
                    categoryData={categories.find(
                      (c) => c.name.toLowerCase() === activeCategory.toLowerCase()
                    )}
                    onClose={() => setActiveCategory(null)}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>
        </header>
      </div>

      {/* Slide-out Cart Drawer global overlay */}
      <CartDrawer />

      {/* Responsive Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 md:hidden cursor-pointer"
            />

            {/* Sidebar menu panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-full sm:max-w-xs bg-white z-50 flex flex-col md:hidden shadow-2xl"
            >
              {/* Header */}
              <div className="p-4 border-b border-brand-grey flex items-center justify-between bg-brand-sand">
                <span className="font-display font-semibold text-sm tracking-wider uppercase text-brand-charcoal">
                  Shop West Elm
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 hover:bg-brand-sand rounded-full transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-brand-charcoal" />
                </button>
              </div>

              {/* Mobile Search Input */}
              <div className="p-4 border-b border-brand-grey">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search collections..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-brand-sand border border-brand-grey text-xs py-2.5 pl-3 pr-9 tracking-wide focus:outline-none focus:border-brand-charcoal"
                    />
                    <button
                      type="submit"
                      className="absolute right-0.5 top-0.5 bottom-0.5 px-2.5 flex items-center justify-center text-brand-grey-dark cursor-pointer"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Categories list */}
              <div className="flex-1 overflow-y-auto py-3">
                <nav className="flex flex-col">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={cat.href || `/category/${cat.slug || cat.name.toLowerCase()}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-6 py-4 flex items-center justify-between border-b border-brand-sand hover:bg-brand-sand group transition-all duration-200"
                    >
                      <span className="font-display font-medium text-sm tracking-widest uppercase text-brand-charcoal">
                        {cat.name}
                      </span>
                      <ArrowRight className="w-4 h-4 text-brand-grey-dark group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Footer Panel */}
              <div className="p-4 bg-brand-sand border-t border-brand-grey space-y-3">
                {!session ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-3.5 bg-brand-charcoal text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <User className="w-4 h-4" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-3.5 border border-brand-charcoal text-brand-charcoal text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2 bg-white shadow-sm"
                    >
                      <span>Register</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-center py-1">
                      <p className="text-[10px] text-brand-grey-dark uppercase tracking-wider">Logged in as</p>
                      <p className="text-xs font-bold text-brand-charcoal mt-0.5">{session?.user?.name || "Valued Customer"}</p>
                    </div>

                    {(session?.user as any)?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full py-3 bg-amber-50 border border-amber-300 text-amber-800 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2 shadow-sm animate-pulse"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/login?tab=profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="py-3 bg-white border border-brand-grey text-brand-charcoal text-[9px] font-semibold uppercase tracking-widest flex items-center justify-center space-x-1.5"
                      >
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="py-3 bg-brand-clay text-white text-[9px] font-bold uppercase tracking-widest flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
                <div className="text-center pt-1.5">
                  <p className="text-[10px] text-brand-grey-dark leading-relaxed">
                    Designed to live. Made to last. FSC®-certified furniture.
                  </p>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
