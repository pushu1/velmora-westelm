import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// --- Mock Data Fallback for Development ---
export interface MockVariant {
  id: string;
  productId: string;
  colorName: string;
  colorHex: string;
  sku: string;
  stock: number;
  imageUrls: string[];
}

export interface MockProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  discountPrice: number | null;
  inventoryCount: number;
  categoryId: string;
  categoryName: string;
  variants: MockVariant[];
}

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export const mockCategories: MockCategory[] = [
  { id: 'cat-1', name: 'Furniture', slug: 'furniture', description: 'Modern sofas, dining tables, chairs, and bedroom sets designed for elegant living.' },
  { id: 'cat-2', name: 'Bedding', slug: 'bedding', description: 'Premium duvet covers, sheets, quilts, and pillows crafted from the finest organic linen and cotton.' },
  { id: 'cat-3', name: 'Bath', slug: 'bath', description: 'Luxurious towels, bath mats, shower curtains, and bath accessories to create a spa-like retreat.' },
  { id: 'cat-4', name: 'Outdoor', slug: 'outdoor', description: 'Weather-resistant outdoor sofas, lounge chairs, dining tables, and concrete planters.' }
];

export const mockProducts: MockProduct[] = [
  // --- FURNITURE ---
  {
    id: 'prod-1',
    title: 'Haven Sofa',
    slug: 'haven-sofa',
    description: 'Defined by its deep seat, low frame, and plush, pillow-like cushions, our Haven Sofa is the ultimate style for lounging. Hand-built by skilled craftsmen, it represents the gold standard of comfortable modern living.',
    basePrice: 89999.00,
    discountPrice: 79999.00,
    inventoryCount: 15,
    categoryId: 'cat-1',
    categoryName: 'Furniture',
    variants: [
      {
        id: 'var-1-1',
        productId: 'prod-1',
        colorName: 'Pewter Gray Velvet',
        colorHex: '#808080',
        sku: 'WE-FUR-HAVEN-PEWTER',
        stock: 8,
        imageUrls: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'var-1-2',
        productId: 'prod-1',
        colorName: 'Camel Saddle Leather',
        colorHex: '#c19a6b',
        sku: 'WE-FUR-HAVEN-CAMEL',
        stock: 7,
        imageUrls: [
          'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-2',
    title: 'Oliver Accent Chair',
    slug: 'oliver-accent-chair',
    description: 'With its plush curves and textured upholstery, the Oliver Accent Chair brings mid-century warmth and modern comfort to any corner. Its compact profile makes it ideal for smaller spaces without sacrificing lounge-worthiness.',
    basePrice: 24999.00,
    discountPrice: null,
    inventoryCount: 30,
    categoryId: 'cat-1',
    categoryName: 'Furniture',
    variants: [
      {
        id: 'var-2-1',
        productId: 'prod-2',
        colorName: 'Alabaster Bouclé',
        colorHex: '#faf0e6',
        sku: 'WE-FUR-OLIVER-ALABASTER',
        stock: 15,
        imageUrls: [
          'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'var-2-2',
        productId: 'prod-2',
        colorName: 'Olive Green Velvet',
        colorHex: '#3b5323',
        sku: 'WE-FUR-OLIVER-OLIVE',
        stock: 15,
        imageUrls: [
          'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-3',
    title: 'Mid-Century Dining Table',
    slug: 'mid-century-dining-table',
    description: 'Clean lines, beveled edges, and signature tapered legs give this dining table a classic, retro silhouette. Made from FSC-certified wood, it expands easily to accommodate larger dinner parties with a drop-in leaf.',
    basePrice: 65999.00,
    discountPrice: 59999.00,
    inventoryCount: 10,
    categoryId: 'cat-1',
    categoryName: 'Furniture',
    variants: [
      {
        id: 'var-3-1',
        productId: 'prod-3',
        colorName: 'Acorn Brown',
        colorHex: '#7b3f00',
        sku: 'WE-FUR-MCDT-ACORN',
        stock: 6,
        imageUrls: [
          'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'var-3-2',
        productId: 'prod-3',
        colorName: 'Dark Walnut',
        colorHex: '#3d2314',
        sku: 'WE-FUR-MCDT-WALNUT',
        stock: 4,
        imageUrls: [
          'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-4',
    title: 'Anton Canopy Bed',
    slug: 'anton-canopy-bed',
    description: 'Crafted from solid mango wood, the Anton Canopy Bed brings dramatic height and organic warmth to the bedroom. Its strong, structural lines are softened by the rich, natural graining of the wood.',
    basePrice: 94999.00,
    discountPrice: 89999.00,
    inventoryCount: 8,
    categoryId: 'cat-1',
    categoryName: 'Furniture',
    variants: [
      {
        id: 'var-4-1',
        productId: 'prod-4',
        colorName: 'Cerused Natural Oak',
        colorHex: '#dfd7c2',
        sku: 'WE-FUR-ANTON-NATURAL',
        stock: 4,
        imageUrls: [
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'var-4-2',
        productId: 'prod-4',
        colorName: 'Dark Oak',
        colorHex: '#2b1d0c',
        sku: 'WE-FUR-ANTON-DARK',
        stock: 4,
        imageUrls: [
          'https://images.unsplash.com/photo-1505693395321-883724634266?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-5',
    title: 'Modern Chesterfield Sofa',
    slug: 'modern-chesterfield-sofa',
    description: 'A contemporary spin on a timeless classic. The Modern Chesterfield Sofa combines deep tufting and stately rolled arms with a clean, low-slung base and sleek metal legs.',
    basePrice: 119999.00,
    discountPrice: null,
    inventoryCount: 12,
    categoryId: 'cat-1',
    categoryName: 'Furniture',
    variants: [
      {
        id: 'var-5-1',
        productId: 'prod-5',
        colorName: 'Cocoa Top-Grain Leather',
        colorHex: '#4a2c11',
        sku: 'WE-FUR-CHESTER-COCOA',
        stock: 6,
        imageUrls: [
          'https://images.unsplash.com/photo-1550254478-ead40cd825c0?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'var-5-2',
        productId: 'prod-5',
        colorName: 'Midnight Navy Velvet',
        colorHex: '#0f1a2c',
        sku: 'WE-FUR-CHESTER-NAVY',
        stock: 6,
        imageUrls: [
          'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-6',
    title: 'Industrial Storage Desk',
    slug: 'industrial-storage-desk',
    description: 'Work efficiently in style. Made from sustainably sourced mango wood and supported by a durable powder-coated iron frame, this desk features two deep drawers for office essentials.',
    basePrice: 38999.00,
    discountPrice: 34999.00,
    inventoryCount: 20,
    categoryId: 'cat-1',
    categoryName: 'Furniture',
    variants: [
      {
        id: 'var-6-1',
        productId: 'prod-6',
        colorName: 'Raw Mango Wood',
        colorHex: '#c29b68',
        sku: 'WE-FUR-DESK-MANGO',
        stock: 10,
        imageUrls: [
          'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'var-6-2',
        productId: 'prod-6',
        colorName: 'Café Bronze Wood',
        colorHex: '#5e4835',
        sku: 'WE-FUR-DESK-BRONZE',
        stock: 10,
        imageUrls: [
          'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-7',
    title: 'Slope Leather Bar Stool',
    slug: 'slope-leather-bar-stool',
    description: 'Designed to fit comfortably under counters, our popular Slope Stool features a beautifully curved seat upholstered in luxurious, hand-finished aniline leather.',
    basePrice: 19999.00,
    discountPrice: null,
    inventoryCount: 25,
    categoryId: 'cat-1',
    categoryName: 'Furniture',
    variants: [
      {
        id: 'var-7-1',
        productId: 'prod-7',
        colorName: 'Saddle Aniline Leather',
        colorHex: '#a0522d',
        sku: 'WE-FUR-SLOPE-SADDLE',
        stock: 13,
        imageUrls: [
          'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1561677978-583a8c7a4b43?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'var-7-2',
        productId: 'prod-7',
        colorName: 'Charcoal Aniline Leather',
        colorHex: '#3a3a3a',
        sku: 'WE-FUR-SLOPE-CHARCOAL',
        stock: 12,
        imageUrls: [
          'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },

  // --- BEDDING ---
  {
    id: 'prod-8',
    title: 'Belgian Flax Linen Duvet Cover',
    slug: 'belgian-flax-linen-duvet',
    description: 'Loomed from premium French and Belgian flax, our linen duvet cover is pre-washed for incredible softness. Naturally breathable and temperature-regulating, it keeps you cool in summer and cozy in winter.',
    basePrice: 14999.00,
    discountPrice: 12999.00,
    inventoryCount: 40,
    categoryId: 'cat-2',
    categoryName: 'Bedding',
    variants: [
      {
        id: 'var-8-1',
        productId: 'prod-8',
        colorName: 'Natural Flax',
        colorHex: '#d2b48c',
        sku: 'WE-BED-BFL-FLAX',
        stock: 20,
        imageUrls: [
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'var-8-2',
        productId: 'prod-8',
        colorName: 'Stark White',
        colorHex: '#ffffff',
        sku: 'WE-BED-BFL-WHITE',
        stock: 20,
        imageUrls: [
          'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-9',
    title: 'Tencel Grid Sheet Set',
    slug: 'tencel-grid-sheets',
    description: 'Woven from silky-soft, sustainably sourced Tencel fibers. This sheet set features a subtle modern grid pattern and offers a cool-to-the-touch feel, making it perfect for warm sleepers.',
    basePrice: 8999.00,
    discountPrice: null,
    inventoryCount: 50,
    categoryId: 'cat-2',
    categoryName: 'Bedding',
    variants: [
      {
        id: 'var-9-1',
        productId: 'prod-9',
        colorName: 'Alabaster Gray',
        colorHex: '#e3e4e5',
        sku: 'WE-BED-GRID-ALABASTER',
        stock: 25,
        imageUrls: [
          'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'var-9-2',
        productId: 'prod-9',
        colorName: 'Slate Blue',
        colorHex: '#708090',
        sku: 'WE-BED-GRID-SLATE',
        stock: 25,
        imageUrls: [
          'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1505693395321-883724634266?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-10',
    title: 'Cloud Cotton Quilt',
    slug: 'cloud-cotton-quilt',
    description: 'Thick, airy, and incredibly soft, this quilt is made from three layers of brushed organic cotton. Its lofty feel replicates the fluffiness of a cloud, keeping you floating in pure comfort.',
    basePrice: 11999.00,
    discountPrice: 9999.00,
    inventoryCount: 35,
    categoryId: 'cat-2',
    categoryName: 'Bedding',
    variants: [
      {
        id: 'var-10-1',
        productId: 'prod-10',
        colorName: 'Terracotta Rust',
        colorHex: '#c04e22',
        sku: 'WE-BED-CLOUD-TERRACOTTA',
        stock: 18,
        imageUrls: [
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'var-10-2',
        productId: 'prod-10',
        colorName: 'Sea Salt Ivory',
        colorHex: '#f5f5dc',
        sku: 'WE-BED-CLOUD-SEASALT',
        stock: 17,
        imageUrls: [
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },

  // --- BATH ---
  {
    id: 'prod-11',
    title: 'Organic Cotton Towel Set',
    slug: 'organic-cotton-towels',
    description: 'Woven from long-staple certified organic cotton, these plush towels offer exceptional absorbency and an ultra-soft feel. Designed with a clean ribbed border for a hotel-like aesthetic.',
    basePrice: 3499.00,
    discountPrice: 2999.00,
    inventoryCount: 80,
    categoryId: 'cat-3',
    categoryName: 'Bath',
    variants: [
      {
        id: 'var-11-1',
        productId: 'prod-11',
        colorName: 'Stone Gray',
        colorHex: '#778899',
        sku: 'WE-BTH-TOWEL-STONE',
        stock: 40,
        imageUrls: [
          'https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'var-11-2',
        productId: 'prod-11',
        colorName: 'Eucalyptus Green',
        colorHex: '#8fbc8f',
        sku: 'WE-BTH-TOWEL-EUCALYPTUS',
        stock: 40,
        imageUrls: [
          'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-12',
    title: 'Mid-Century Bath Mat',
    slug: 'mid-century-bath-mat',
    description: 'Add a retro geometric touch to your bath space. This tufted organic cotton mat features a bold mid-century pattern and absorbs moisture quickly to keep floors clean and dry.',
    basePrice: 2499.00,
    discountPrice: null,
    inventoryCount: 60,
    categoryId: 'cat-3',
    categoryName: 'Bath',
    variants: [
      {
        id: 'var-12-1',
        productId: 'prod-12',
        colorName: 'Ochre Yellow',
        colorHex: '#cc7722',
        sku: 'WE-BTH-MAT-OCHRE',
        stock: 30,
        imageUrls: [
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'var-12-2',
        productId: 'prod-12',
        colorName: 'Charcoal Black',
        colorHex: '#2f4f4f',
        sku: 'WE-BTH-MAT-CHARCOAL',
        stock: 30,
        imageUrls: [
          'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-13',
    title: 'Waffle Weave Bathrobe',
    slug: 'waffle-weave-bathrobe',
    description: 'Loomed from 100% organic cotton, this lightweight, fast-drying bathrobe features a textured waffle grid. Perfect for post-shower lounging and warmer months.',
    basePrice: 5999.00,
    discountPrice: 4999.00,
    inventoryCount: 45,
    categoryId: 'cat-3',
    categoryName: 'Bath',
    variants: [
      {
        id: 'var-13-1',
        productId: 'prod-13',
        colorName: 'Sage Green',
        colorHex: '#9cc2a3',
        sku: 'WE-BTH-ROBE-SAGE',
        stock: 22,
        imageUrls: [
          'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'var-13-2',
        productId: 'prod-13',
        colorName: 'Off-White',
        colorHex: '#fcfaf2',
        sku: 'WE-BTH-ROBE-WHITE',
        stock: 23,
        imageUrls: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-14',
    title: 'Terrazzo Soap Dispenser',
    slug: 'terrazzo-soap-dispenser',
    description: 'Handcrafted from durable concrete and speckled stone, our Terrazzo Soap Dispenser adds elegant texture and modern style to kitchen or bathroom countertops.',
    basePrice: 1999.00,
    discountPrice: null,
    inventoryCount: 90,
    categoryId: 'cat-3',
    categoryName: 'Bath',
    variants: [
      {
        id: 'var-14-1',
        productId: 'prod-14',
        colorName: 'White Terrazzo',
        colorHex: '#e8e8e8',
        sku: 'WE-BTH-SOAP-WHITE',
        stock: 45,
        imageUrls: [
          'https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'var-14-2',
        productId: 'prod-14',
        colorName: 'Black Terrazzo',
        colorHex: '#1c1c1c',
        sku: 'WE-BTH-SOAP-BLACK',
        stock: 45,
        imageUrls: [
          'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },

  // --- OUTDOOR ---
  {
    id: 'prod-15',
    title: 'Portside Outdoor Sofa',
    slug: 'portside-outdoor-sofa',
    description: 'Rustic yet refined, the Portside Sofa features a moisture-resistant solid wood frame with a weathered finish. Thick, durable cushions are upholstered in fade-proof Sunbrella fabric.',
    basePrice: 99999.00,
    discountPrice: 89999.00,
    inventoryCount: 10,
    categoryId: 'cat-4',
    categoryName: 'Outdoor',
    variants: [
      {
        id: 'var-15-1',
        productId: 'prod-15',
        colorName: 'Driftwood Gray',
        colorHex: '#8b8682',
        sku: 'WE-OUT-PORT-GRAY',
        stock: 5,
        imageUrls: [
          'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'var-15-2',
        productId: 'prod-15',
        colorName: 'Weathered Oak',
        colorHex: '#bfa38a',
        sku: 'WE-OUT-PORT-OAK',
        stock: 5,
        imageUrls: [
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-16',
    title: 'Huron Outdoor Lounge Chair',
    slug: 'huron-outdoor-lounge-chair',
    description: 'Inspired by classic mid-century design, the Huron Chair features hand-woven, weather-resistant cording wrapped around a rust-proof powder-coated aluminum frame.',
    basePrice: 27999.00,
    discountPrice: null,
    inventoryCount: 18,
    categoryId: 'cat-4',
    categoryName: 'Outdoor',
    variants: [
      {
        id: 'var-16-1',
        productId: 'prod-16',
        colorName: 'Slate Woven Cording',
        colorHex: '#556b2f',
        sku: 'WE-OUT-HURON-SLATE',
        stock: 9,
        imageUrls: [
          'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'var-16-2',
        productId: 'prod-16',
        colorName: 'Natural Woven Cording',
        colorHex: '#cd853f',
        sku: 'WE-OUT-HURON-NATURAL',
        stock: 9,
        imageUrls: [
          'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-17',
    title: 'Playa Outdoor Dining Table',
    slug: 'playa-outdoor-dining-table',
    description: 'Bring modern luxury to your patio. Crafted from solid sustainably harvested teak wood, the Playa Dining Table naturally resists moisture and ages to a beautiful silver-gray patina.',
    basePrice: 79999.00,
    discountPrice: 74999.00,
    inventoryCount: 7,
    categoryId: 'cat-4',
    categoryName: 'Outdoor',
    variants: [
      {
        id: 'var-17-1',
        productId: 'prod-17',
        colorName: 'Natural Teak Wood',
        colorHex: '#b5651d',
        sku: 'WE-OUT-PLAYA-TEAK',
        stock: 4,
        imageUrls: [
          'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'var-17-2',
        productId: 'prod-17',
        colorName: 'Charcoal Wash Wood',
        colorHex: '#2e2e2e',
        sku: 'WE-OUT-PLAYA-CHARCOAL',
        stock: 3,
        imageUrls: [
          'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-18',
    title: 'Concrete Pedestal Planter',
    slug: 'concrete-pedestal-planter',
    description: 'Durable, minimal, and structural. Our concrete planters are made from lightweight glass-fiber reinforced concrete. Elevate your plants with this architectural statement piece.',
    basePrice: 7999.00,
    discountPrice: null,
    inventoryCount: 40,
    categoryId: 'cat-4',
    categoryName: 'Outdoor',
    variants: [
      {
        id: 'var-18-1',
        productId: 'prod-18',
        colorName: 'Light Gray Concrete',
        colorHex: '#d3d3d3',
        sku: 'WE-OUT-PLANT-LIGHT',
        stock: 20,
        imageUrls: [
          'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'var-18-2',
        productId: 'prod-18',
        colorName: 'Dark Charcoal Concrete',
        colorHex: '#474747',
        sku: 'WE-OUT-PLANT-DARK',
        stock: 20,
        imageUrls: [
          'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },

  // --- HOME DECOR / EXTRA PRODUCTS ---
  {
    id: 'prod-19',
    title: 'Speckled Ceramic Vases',
    slug: 'speckled-ceramic-vases',
    description: 'Hand-thrown speckled earthenware vases featuring a raw, tactile base and a matte glazed top. Beautiful as single sculptural accents or styled together with floral stems.',
    basePrice: 2999.00,
    discountPrice: 2499.00,
    inventoryCount: 100,
    categoryId: 'cat-3',
    categoryName: 'Bath',
    variants: [
      {
        id: 'var-19-1',
        productId: 'prod-19',
        colorName: 'Sand Beige',
        colorHex: '#e1a6ad',
        sku: 'WE-DEC-VASE-SAND',
        stock: 50,
        imageUrls: [
          'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'var-19-2',
        productId: 'prod-19',
        colorName: 'White Speckle',
        colorHex: '#ffffff',
        sku: 'WE-DEC-VASE-WHITE',
        stock: 50,
        imageUrls: [
          'https://images.unsplash.com/photo-1581781868910-bf962c45388c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-20',
    title: 'Curved Upholstered Bed',
    slug: 'curved-upholstered-bed',
    description: 'With its soft, shelter-style headboard and tailored piping details, the Curved Upholstered Bed wraps you in comfort. Its elegant frame sits low to the ground for a modern bedroom aesthetic.',
    basePrice: 79999.00,
    discountPrice: null,
    inventoryCount: 14,
    categoryId: 'cat-1',
    categoryName: 'Furniture',
    variants: [
      {
        id: 'var-20-1',
        productId: 'prod-20',
        colorName: 'Stone Bouclé',
        colorHex: '#ebe8de',
        sku: 'WE-FUR-BED-BOUCLE',
        stock: 7,
        imageUrls: [
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'var-20-2',
        productId: 'prod-20',
        colorName: 'Dusty Blue Velvet',
        colorHex: '#6a7b83',
        sku: 'WE-FUR-BED-VELVET',
        stock: 7,
        imageUrls: [
          'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  }
];

// Helper to query safe data that automatically falls back to mock data if database is down
export async function getProducts(options?: { categorySlug?: string; query?: string }) {
  try {
    // Check if the database can be reached (timeout of 1.5s)
    const dbPromise = prisma.product.findMany({
      include: { variants: true, category: true }
    });
    
    // Race with a timeout so we don't block requests if DB is unreachable
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 1500));
    const dbProducts = await Promise.race([dbPromise, timeoutPromise]) as any[];

    let filtered = dbProducts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      basePrice: p.basePrice,
      discountPrice: p.discountPrice,
      inventoryCount: p.inventoryCount,
      categoryId: p.categoryId,
      categoryName: p.category.name,
      variants: p.variants.map((v: any) => ({
        id: v.id,
        productId: v.productId,
        colorName: v.colorName,
        colorHex: v.colorHex,
        sku: v.sku,
        stock: v.stock,
        imageUrls: v.imageUrls
      }))
    }));

    if (options?.categorySlug) {
      filtered = filtered.filter((p) => p.categoryName.toLowerCase() === options.categorySlug?.toLowerCase());
    }

    if (options?.query) {
      const q = options.query.toLowerCase();
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    return filtered;
  } catch (error) {
    console.warn('⚠️ Database connection failed. Falling back to structured mock dataset.');
    let filtered = [...mockProducts];

    if (options?.categorySlug) {
      filtered = filtered.filter((p) => p.categoryName.toLowerCase() === options.categorySlug?.toLowerCase());
    }

    if (options?.query) {
      const q = options.query.toLowerCase();
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    return filtered;
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const dbPromise = prisma.product.findFirst({
      where: { slug },
      include: { variants: true, category: true }
    });
    
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 1500));
    const p = await Promise.race([dbPromise, timeoutPromise]) as any;

    if (!p) return mockProducts.find((mp) => mp.slug === slug) || null;

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      basePrice: p.basePrice,
      discountPrice: p.discountPrice,
      inventoryCount: p.inventoryCount,
      categoryId: p.categoryId,
      categoryName: p.category.name,
      variants: p.variants.map((v: any) => ({
        id: v.id,
        productId: v.productId,
        colorName: v.colorName,
        colorHex: v.colorHex,
        sku: v.sku,
        stock: v.stock,
        imageUrls: v.imageUrls
      }))
    };
  } catch (error) {
    return mockProducts.find((mp) => mp.slug === slug) || null;
  }
}
