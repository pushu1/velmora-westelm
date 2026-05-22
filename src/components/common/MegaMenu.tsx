'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Section } from '@/config/navigation';

interface MegaMenuProps {
  activeCategoryName: string | null;
  categoryData: Section | undefined;
  onClose: () => void;
}

// Luxurious featured static promotions mapped by root category slug
const featuredPromoMeta: Record<string, {
  image: string;
  title: string;
  subtitle: string;
}> = {
  furniture: {
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80',
    title: 'Signature Haven Collection',
    subtitle: 'Plush velvet, deep profiles, unmatched comfort.'
  },
  'outdoor-and-garden': {
    image: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=400&q=80',
    title: 'Al Fresco Modern Living',
    subtitle: 'FSC®-certified solid teak wood designed to last generations.'
  },
  'bedding-and-bath': {
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80',
    title: 'Belgian Flax Linen & Bath',
    subtitle: 'Pre-washed organic flax bedsheets, handcrafted bath linens.'
  },
  'pillows-and-decor': {
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80',
    title: 'Signature Artisanal Decor',
    subtitle: 'Handwoven covers, bespoke planters, and organic botanical scents.'
  },
  'kitchen-and-dining': {
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=400&q=80',
    title: 'Editorial Dinnerware',
    subtitle: 'Matte glazed stoneware sets, fine glassware, and elegant runners.'
  },
  lighting: {
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80',
    title: 'Mid-Century Modern Lamps',
    subtitle: 'Architectural lamps and custom brass chandeliers.'
  },
  rugs: {
    image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=400&q=80',
    title: 'Textured Hand-Woven Rugs',
    subtitle: 'Loomed from wool and tencel. Designed for luxury.'
  },
  'art-and-mirrors': {
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&q=80',
    title: 'Bespoke Wall Features',
    subtitle: 'Grand framed wall mirrors and hand-selected artistic creations.'
  },
  gifts: {
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=400&q=80',
    title: 'Curated Celebrations',
    subtitle: 'Deluxe presents and personalized hampers for special hosts.'
  },
  sale: {
    image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=400&q=80',
    title: 'The Design Clearance Event',
    subtitle: 'Save up to 40% on signature furniture and seasonal decor.'
  },
  default: {
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80',
    title: 'Luxury Home Collections',
    subtitle: 'Handpicked bespoke articles crafted for premium aesthetics.'
  }
};

export default function MegaMenu({ activeCategoryName, categoryData, onClose }: MegaMenuProps) {
  if (!categoryData) return null;

  const slug = categoryData.slug?.toLowerCase() || 'default';
  const promo = featuredPromoMeta[slug] || featuredPromoMeta.default;

  const children = categoryData.children || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="absolute left-0 right-0 top-full bg-white border-b border-brand-grey shadow-xl z-50 overflow-hidden"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-6 gap-8">
        
        {/* Subcategories columns - maps Tier 2 (Sub-Section) and Tier 3 (Sub-sub-section) */}
        <div className="col-span-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
          {children.map((col, index) => {
            const hasChildren = col.children && col.children.length > 0;
            return (
              <div key={col.slug || index} className="flex flex-col space-y-3.5">
                
                {/* Tier 2 Sub-Section Header */}
                <h3 className="font-display font-semibold text-xs tracking-wider uppercase text-brand-charcoal border-b border-brand-grey pb-1.5">
                  <Link
                    href={col.href}
                    onClick={onClose}
                    className="hover:text-brand-clay transition-colors duration-200"
                  >
                    {col.name}
                  </Link>
                </h3>
                
                {/* Tier 3 Clickable Link Items */}
                {hasChildren ? (
                  <ul className="space-y-2">
                    {col.children.map((item, itemIdx) => (
                      <li key={item.slug || itemIdx}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="text-xs text-brand-grey-dark hover:text-brand-charcoal hover:underline transition-all duration-200 block"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[10px] text-brand-grey-dark/50 font-medium tracking-wide leading-relaxed italic">
                    Shop exclusive designs directly.
                  </p>
                )}

              </div>
            );
          })}
        </div>

        {/* Featured Promotion Column */}
        <div className="col-span-1 flex flex-col space-y-4 border-l border-brand-grey pl-8 justify-between">
          <div>
            <h3 className="font-display font-semibold text-[10px] tracking-widest uppercase text-brand-clay mb-3">
              Featured Collection
            </h3>
            <div className="relative aspect-[4/3] w-full overflow-hidden mb-3 group bg-brand-sand">
              <Image
                src={promo.image}
                alt={promo.title}
                fill
                sizes="(max-w-md) 100vw, 300px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                fetchPriority="low"
              />
            </div>
            <h4 className="font-display text-sm font-semibold text-brand-charcoal leading-snug">
              {promo.title}
            </h4>
            <p className="text-xs text-brand-grey-dark mt-1 leading-relaxed">
              {promo.subtitle}
            </p>
          </div>
          <Link
            href={categoryData.href}
            onClick={onClose}
            className="text-[10px] font-bold tracking-widest uppercase border-b-2 border-brand-charcoal text-brand-charcoal self-start pb-0.5 hover:text-brand-clay hover:border-brand-clay transition-all duration-200"
          >
            Shop All {categoryData.name}
          </Link>
        </div>

      </div>
    </motion.div>
  );
}
