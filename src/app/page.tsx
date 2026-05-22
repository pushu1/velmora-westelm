import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Award, RotateCcw, Truck } from 'lucide-react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import ProductCard from '@/components/common/ProductCard';
import { getProducts } from '@/lib/db';

// Hero slides data
const heroSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80',
    title: 'THE SIGNATURE HAVEN COLLECTION',
    subtitle: 'Deep Profiles, Plush Cushions & Unmatched Comfort',
    description: 'Transform your living space with our best-selling Haven Sofa. Crafted with double-dowel frames and hand-upholstered in high-density gray velvet.',
    link: '/product/haven-sofa',
    linkLabel: 'Explore Haven Sofa'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=80',
    title: 'BELGIAN FLAX LINEN BEDDING',
    subtitle: 'Loomed from Premium French Flax, Pre-washed for Softness',
    description: 'Naturally breathable, highly durable, and temperature-regulating. Discover the effortless luxury of pre-washed Belgian flax linen.',
    link: '/product/belgian-flax-linen-duvet',
    linkLabel: 'Shop Linen Duvet'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=1600&q=80',
    title: 'OUTDOOR PORT SIDE LIVING',
    subtitle: 'FSC®-Certified Teak Wood Designed to Last Generations',
    description: 'Moisture-resistant solid teak frames styled with weathered finish. Paired with fade-proof premium Sunbrella fabric cushions.',
    link: '/product/portside-outdoor-sofa',
    linkLabel: 'Shop Outdoor Sofa'
  }
];

// Value propositions
const values = [
  {
    icon: Award,
    title: 'Artisan Crafted',
    desc: 'Supporting local craft communities globally.'
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    desc: 'Complimentary delivery on orders above ₹49,999.'
  },
  {
    icon: RotateCcw,
    title: 'Simple Returns',
    desc: 'Hassle-free 14-day exchange program.'
  }
];

export default async function Home() {
  const products = await getProducts();
  
  // Show first 8 products in the trending section
  const trendingProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Premium Navigation Header */}
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* Luxury Hero Slider Section */}
        <section className="relative w-full aspect-[16/9] md:h-[680px] bg-brand-sand overflow-hidden">
          {/* We show the first slide as primary with fetchPriority=high */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={heroSlides[0].image}
              alt={heroSlides[0].title}
              fill
              sizes="100vw"
              priority
              className="object-cover"
              fetchPriority="high"
            />
            {/* Dark glassmorphism overlay */}
            <div className="absolute inset-0 bg-black/25" />
          </div>

          {/* Hero Content Box */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
              <div className="max-w-xl text-white space-y-4 md:space-y-6">
                <span className="font-display font-semibold text-[10px] md:text-xs tracking-[0.25em] uppercase text-brand-sand flex items-center space-x-2">
                  <Sparkles className="w-4.5 h-4.5 text-brand-clay" />
                  <span>Exclusive Premiere</span>
                </span>
                
                <h1 className="font-display font-bold text-3xl md:text-5xl leading-tight tracking-wide text-white">
                  {heroSlides[0].title}
                </h1>
                
                <p className="font-display text-sm md:text-lg font-medium text-brand-sand leading-snug">
                  {heroSlides[0].subtitle}
                </p>
                
                <p className="text-xs md:text-sm text-brand-grey/90 leading-relaxed font-normal max-w-lg hidden sm:block">
                  {heroSlides[0].description}
                </p>

                <div className="pt-2 md:pt-4">
                  <Link
                    href={heroSlides[0].link}
                    className="inline-flex items-center space-x-3 px-6 md:px-8 py-3.5 bg-white text-brand-charcoal text-xs font-bold uppercase tracking-widest hover:bg-brand-charcoal hover:text-white transition-all duration-300 shadow-md group"
                  >
                    <span>{heroSlides[0].linkLabel}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Propositions section */}
        <section className="bg-brand-sand py-8 border-b border-brand-grey/50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={i} className="flex items-center justify-center space-x-4 text-center sm:text-left">
                <v.icon className="w-5 h-5 text-brand-clay flex-shrink-0" />
                <div>
                  <h3 className="font-display font-semibold text-xs tracking-wider uppercase text-brand-charcoal">
                    {v.title}
                  </h3>
                  <p className="text-[11px] text-brand-grey-dark mt-0.5 font-normal">
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Masonry Category Grid Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 w-full">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <h2 className="font-display font-semibold text-2xl md:text-3xl tracking-wide text-brand-charcoal uppercase">
              Curate Your Home
            </h2>
            <p className="text-xs md:text-sm text-brand-grey-dark leading-relaxed">
              Explore our designer-curated collections crafted to bring luxury, warmth, and signature style to every corner.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Furniture',
                slug: 'furniture',
                image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80',
                desc: 'Sofas, Tables, & Canopy Beds'
              },
              {
                title: 'Bedding',
                slug: 'bedding',
                image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
                desc: 'Linen Duvets & Sheet Sets'
              },
              {
                title: 'Bath',
                slug: 'bath',
                image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=600&q=80',
                desc: 'Organic Towels & Soap Dispensers'
              },
              {
                title: 'Outdoor',
                slug: 'outdoor',
                image: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=600&q=80',
                desc: 'Solid Teak Lounge Setups'
              }
            ].map((cat) => (
              <Link
                key={cat.title}
                href={`/category/${cat.slug}`}
                className="group relative aspect-[3/4] overflow-hidden bg-brand-sand shadow-sm"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-w-md) 100vw, 280px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  fetchPriority="low"
                />
                {/* Visual glass overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <h3 className="font-display font-semibold text-lg tracking-wider uppercase">
                    {cat.title}
                  </h3>
                  <p className="text-[10px] text-brand-sand/80 uppercase tracking-widest font-mono">
                    {cat.desc}
                  </p>
                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold tracking-widest uppercase border-b-2 border-white self-start pb-0.5 pt-2 group-hover:text-brand-clay group-hover:border-brand-clay transition-all duration-300">
                    <span>Shop Collection</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Editorial Story Block Section: "The Sanctuary Collection" */}
        <section className="bg-brand-sand/40 border-y border-brand-grey/50 py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Large Portrait Image */}
            <div className="relative aspect-[4/5] w-full overflow-hidden shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80"
                alt="Sanctuary Collection Design"
                fill
                sizes="(max-w-7xl) 50vw, 600px"
                className="object-cover"
                fetchPriority="low"
              />
            </div>
            
            {/* Right: Editorial Story */}
            <div className="space-y-6 lg:pl-8">
              <span className="font-display font-semibold text-[10px] tracking-[0.25em] uppercase text-brand-clay">
                Editorial Design Story
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl leading-tight text-brand-charcoal tracking-wide">
                THE MID-CENTURY SANCTUARY
              </h2>
              <p className="text-xs md:text-sm text-brand-grey-dark leading-relaxed font-normal">
                True luxury lies in the marriage of timeless retro shapes and raw natural texture. Our mid-century tables and matching hand-upholstered chairs bring organic warmth and quiet elegance to modern dining rooms.
              </p>
              <div className="space-y-4 pt-2">
                <div className="flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-brand-clay/10 text-brand-clay font-mono text-xs flex items-center justify-center flex-shrink-0 font-bold">1</span>
                  <p className="text-xs text-brand-charcoal leading-relaxed">
                    <span className="font-semibold">FSC®-Certified Wood:</span> Responsibly harvested dark walnut and warm acorns designed to respect the environment.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-brand-clay/10 text-brand-clay font-mono text-xs flex items-center justify-center flex-shrink-0 font-bold">2</span>
                  <p className="text-xs text-brand-charcoal leading-relaxed">
                    <span className="font-semibold">Premium Double-Dowel Joints:</span> Artisanal joinery techniques ensuring structural sturdiness for generations.
                  </p>
                </div>
              </div>
              
              <div className="pt-4">
                <Link
                  href="/category/furniture"
                  className="inline-flex items-center space-x-3 px-8 py-3.5 bg-brand-charcoal text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-clay transition-all duration-300 shadow-md group"
                >
                  <span>Explore Dining Collections</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Signature Trending Products Grid */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2 max-w-xl">
              <span className="font-display font-semibold text-[10px] tracking-[0.25em] uppercase text-brand-clay">
                Trending Signature Pieces
              </span>
              <h2 className="font-display font-semibold text-2xl md:text-3xl tracking-wide text-brand-charcoal uppercase">
                Best Sellers Right Now
              </h2>
              <p className="text-xs md:text-sm text-brand-grey-dark leading-relaxed">
                Handpicked collections designed by interior visionaries and loved by our design enthusiasts.
              </p>
            </div>
            
            <Link
              href="/category/furniture"
              className="inline-flex items-center space-x-1.5 text-xs font-bold tracking-widest uppercase border-b-2 border-brand-charcoal self-start pb-0.5 hover:text-brand-clay hover:border-brand-clay transition-all-custom"
            >
              <span>Explore All Pieces</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {trendingProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      </main>

      {/* Premium Multi-column Editorial Footer */}
      <Footer />
    </div>
  );
}
