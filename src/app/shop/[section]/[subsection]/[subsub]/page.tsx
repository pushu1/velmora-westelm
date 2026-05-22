import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import CategoryCatalog from '@/components/common/CategoryCatalog';
import { resolveShopCategory } from '@/lib/shop';

interface PageProps {
  params: Promise<{ section: string; subsection: string; subsub: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SubSubCategoryPage({ params, searchParams }: PageProps) {
  const { section, subsection, subsub } = await params;
  const resolvedSearchParams = await searchParams;
  const searchQuery = (resolvedSearchParams.search || resolvedSearchParams.query) as string | undefined;

  const resolved = await resolveShopCategory(section, subsection, subsub);

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
