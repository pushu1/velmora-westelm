import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import CategoryCatalog from '@/components/common/CategoryCatalog';
import { resolveShopCategory } from '@/lib/shop';

interface PageProps {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SectionPage({ params, searchParams }: PageProps) {
  const { section } = await params;
  const resolvedSearchParams = await searchParams;
  const searchQuery = (resolvedSearchParams.search || resolvedSearchParams.query) as string | undefined;

  const resolved = await resolveShopCategory(section);

  if (!resolved) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Premium Sticky Navigation Header */}
      <Navbar />

      <main className="flex-1">
        {/* Dynamic Category Catalog View with async filter parameters */}
        <CategoryCatalog
          initialProducts={resolved.products}
          categoryName={resolved.title}
          categoryDescription={resolved.description}
          searchQuery={searchQuery}
        />
      </main>

      {/* Premium Multi-column Editorial Footer */}
      <Footer />
    </div>
  );
}
