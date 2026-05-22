import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import CategoryCatalog from '@/components/common/CategoryCatalog';
import { getProducts } from '@/lib/db';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const categoryMeta: { [key: string]: { name: string; desc: string } } = {
  furniture: {
    name: 'Furniture',
    desc: 'Modern sofas, accent chairs, dining sets, canopy beds, and raw wood desks hand-crafted for elegant interior living.',
  },
  bedding: {
    name: 'Bedding',
    desc: 'Premium organic sheets, duvet covers, cloud cotton quilts, and temperature-regulating Belgian flax linen bedding.',
  },
  bath: {
    name: 'Bath',
    desc: 'Luxurious organic long-staple towels, tufted bath mats, Terrazzo stone dispensers, and waffle weave bathrobes.',
  },
  outdoor: {
    name: 'Outdoor',
    desc: 'Weather-proof teak dining tables, concrete pedestal planters, and outdoor lounge sofas wrapped in Sunbrella fabric.',
  },
  all: {
    name: 'Signature Collections',
    desc: 'Discover our complete catalog of sustainably sourced furniture, organic bedding textiles, spa bath accessories, and outdoor accents.',
  },
};

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const searchQuery = (resolvedSearchParams.search || resolvedSearchParams.query) as string | undefined;

  const activeCategory = categoryMeta[slug.toLowerCase()];

  // If slug is not a valid category meta slug, return Next.js 404
  if (!activeCategory) {
    notFound();
  }

  // Fetch products under the active category. If slug is 'all', fetch all products.
  const categorySlugParam = slug.toLowerCase() === 'all' ? undefined : slug;
  const products = await getProducts({
    categorySlug: categorySlugParam,
    query: searchQuery,
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Premium Sticky Navigation Header */}
      <Navbar />

      <main className="flex-1">
        {/* Dynamic Category Catalog View with async filter parameters */}
        <CategoryCatalog
          initialProducts={products}
          categoryName={activeCategory.name}
          categoryDescription={activeCategory.desc}
          searchQuery={searchQuery}
        />
      </main>

      {/* Premium Multi-column Editorial Footer */}
      <Footer />
    </div>
  );
}
