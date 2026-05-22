import { getProducts, MockProduct } from '@/lib/db';
import { NAVIGATION_DATA } from '@/config/navigation';

export interface ResolvedCategory {
  title: string;
  description: string;
  products: MockProduct[];
}

function filterProductsByKeywords(products: MockProduct[], slug: string): MockProduct[] {
  const s = slug.toLowerCase();
  
  // Specific custom overrides for high-fidelity matches
  if (s === 'sofas-sectionals' || s === 'sofas-sectional') {
    return products.filter(p => 
      p.title.toLowerCase().includes('sofa') || 
      p.title.toLowerCase().includes('sectional') ||
      p.description.toLowerCase().includes('sofa') ||
      p.description.toLowerCase().includes('chesterfield')
    );
  }
  if (s === 'chairs') {
    return products.filter(p => 
      p.title.toLowerCase().includes('chair') && 
      !p.title.toLowerCase().includes('dining') && 
      !p.title.toLowerCase().includes('lounge')
    );
  }
  if (s === 'coffee-tables') {
    return products.filter(p => p.title.toLowerCase().includes('coffee'));
  }
  if (s === 'dining-tables') {
    return products.filter(p => p.title.toLowerCase().includes('dining') && p.title.toLowerCase().includes('table'));
  }
  if (s === 'dining-chairs') {
    return products.filter(p => p.title.toLowerCase().includes('dining') && p.title.toLowerCase().includes('chair'));
  }
  if (s === 'bar-stools' || s === 'dining-bench-and-stools' || s === 'dining-bench-stools') {
    return products.filter(p => p.title.toLowerCase().includes('stool') || p.title.toLowerCase().includes('bench'));
  }
  if (s === 'beds-headboards' || s === 'bed') {
    return products.filter(p => p.title.toLowerCase().includes('bed') || p.title.toLowerCase().includes('canopy'));
  }
  if (s === 'nightstands' || s === 'bedside-tables') {
    return products.filter(p => p.title.toLowerCase().includes('nightstand') || p.title.toLowerCase().includes('bedside'));
  }
  if (s === 'dressers-chests' || s === 'dressers') {
    return products.filter(p => p.title.toLowerCase().includes('dresser') || p.title.toLowerCase().includes('chest'));
  }
  if (s === 'towels') {
    return products.filter(p => p.title.toLowerCase().includes('towel'));
  }
  if (s === 'bath-mats' || s === 'bath-rugs-mats') {
    return products.filter(p => p.title.toLowerCase().includes('mat') || p.title.toLowerCase().includes('rug'));
  }
  if (s === 'bath-accessories' || s === 'spa-accessories') {
    return products.filter(p => 
      p.title.toLowerCase().includes('dispenser') || 
      p.title.toLowerCase().includes('curtain') ||
      p.title.toLowerCase().includes('holder') ||
      p.title.toLowerCase().includes('vase')
    );
  }
  if (s === 'outdoor-living-furniture') {
    return products.filter(p => 
      p.title.toLowerCase().includes('sofa') || 
      p.title.toLowerCase().includes('lounge') || 
      p.title.toLowerCase().includes('chair')
    );
  }
  if (s === 'outdoor-dining-furniture') {
    return products.filter(p => 
      p.title.toLowerCase().includes('dining') || 
      p.title.toLowerCase().includes('table')
    );
  }
  if (s === 'vases' || s === 'speckled-ceramic-vases') {
    return products.filter(p => p.title.toLowerCase().includes('vase'));
  }
  if (s === 'planters' || s === 'indoor-planters' || s === 'outdoor-planters' || s === 'planters-and-botanicals' || s === 'planters-botanicals') {
    return products.filter(p => p.title.toLowerCase().includes('planter') || p.title.toLowerCase().includes('concrete'));
  }

  // Generic fallback keyword matching
  // Split slug into parts and search
  const words = s.split('-');
  return products.filter((p) => {
    const searchStr = `${p.title} ${p.description} ${p.categoryName}`.toLowerCase();
    // If slug is 'all', return all
    if (s.includes('all')) return true;
    // Return true if any word is in product search string
    return words.some(w => w.length > 2 && searchStr.includes(w));
  });
}

export async function resolveShopCategory(
  sectionSlug: string,
  subsectionSlug?: string,
  subsubSlug?: string
): Promise<ResolvedCategory | null> {
  // 1. Find section in navigation config
  const sectionNode = NAVIGATION_DATA.find((s) => s.slug === sectionSlug);
  if (!sectionNode) return null;

  let title = sectionNode.name;
  let description = `Discover our premium collection of ${sectionNode.name.toLowerCase()} carefully crafted to elevate your home.`;
  
  // Determine DB query category
  let dbCategory: string | undefined = undefined;
  let fetchBothBeddingAndBath = false;

  if (sectionSlug === 'furniture') {
    dbCategory = 'Furniture';
  } else if (sectionSlug === 'outdoor-and-garden') {
    dbCategory = 'Outdoor';
  } else if (sectionSlug === 'bedding-and-bath') {
    fetchBothBeddingAndBath = true;
  } else if (sectionSlug === 'pillows-and-decor') {
    // Pillows & Decor
  }

  let products: MockProduct[] = [];
  if (fetchBothBeddingAndBath) {
    const beddingProds = await getProducts({ categorySlug: 'Bedding' });
    const bathProds = await getProducts({ categorySlug: 'Bath' });
    products = [...beddingProds, ...bathProds];
  } else {
    products = await getProducts({ categorySlug: dbCategory });
  }

  // 2. Handle Subsection filtering
  if (subsectionSlug) {
    const subsectionNode = sectionNode.children.find((sub) => sub.slug === subsectionSlug);
    if (!subsectionNode) return null;

    title = subsectionNode.name;
    description = `Explore our curated selection of ${subsectionNode.name.toLowerCase()} designed to bring classic style and modern luxury.`;

    // Filter products for this subsection
    products = filterProductsByKeywords(products, subsectionSlug);

    // 3. Handle Sub-subsection filtering
    if (subsubSlug) {
      const subsubNode = subsectionNode.children.find((item) => item.slug === subsubSlug);
      if (!subsubNode) return null;

      title = subsubNode.name;
      description = `Shop high-end, artisan-crafted ${subsubNode.name.toLowerCase()} tailored for modern luxury aesthetics.`;

      // Further filter products for this sub-subsection
      products = filterProductsByKeywords(products, subsubSlug);
    }
  }

  return {
    title,
    description,
    products,
  };
}
