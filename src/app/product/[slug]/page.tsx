import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import ProductDetails from '@/components/common/ProductDetails';
import { getProductBySlug, getProducts } from '@/lib/db';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Fetch product by slug
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch products in the same category, filter out the current product itself, and get up to 4 items
  const allCategoryProducts = await getProducts({ categorySlug: product.categoryName });
  const relatedProducts = allCategoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Sticky Main Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* Main Product Details View Section with zoom, swatches and related carousels */}
        <ProductDetails product={product} relatedProducts={relatedProducts} />
      </main>

      {/* Premium Multi-column Editorial Footer */}
      <Footer />
    </div>
  );
}
