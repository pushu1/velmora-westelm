export interface SubSubSection {
  name: string;
  slug: string;
  href: string;
}

export interface SubSection {
  name: string;
  slug: string;
  href: string;
  children: SubSubSection[];
}

export interface Section {
  id: string;
  name: string;
  slug: string;
  href: string;
  children: SubSection[];
}

/**
 * Robust slugify utility to create elegant SEO URLs.
 * Handles spaces, symbols, and accents.
 */
export function slugify(text: string): string {
  let s = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // removes accents (e.g. Décor -> Decor)
    .trim()
    .replace(/&/g, 'and')
    .replace(/\+/g, '-')
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Specific high-end styling replacements for cleaner URL structures
  if (s === 'sofas-sectional') return 'sofas-sectionals';
  if (s === 'dining-bench-stools') return 'dining-bench-and-stools';
  if (s === 'desks-chairs') return 'desks-and-chairs';
  if (s === 'faux-plants-flowers') return 'faux-plants-and-flowers';
  if (s === 'lanterns-candle-holders') return 'lanterns-and-candle-holders';
  if (s === 'decorative-objects-sculptures') return 'decorative-objects-and-sculptures';
  if (s === 'candles-diffusers') return 'candles-and-diffusers';
  if (s === 'jewellery-display-boxes') return 'jewellery-and-display-boxes';
  if (s === 'serving-platters-bowls') return 'serving-platters-and-bowls';
  if (s === 'trays-bakeware') return 'trays-and-bakeware';
  if (s === 'bar-accessories-decanters') return 'bar-accessories-and-decanters';
  if (s === 'glassware-stemware') return 'glassware-and-stemware';

  return s;
}

// Intermediate raw structural declaration to keep config readable and dry
interface RawSubSection {
  name: string;
  items?: string[];
}

interface RawSection {
  name: string;
  subSections: RawSubSection[];
}

const RAW_NAVIGATION_TREE: RawSection[] = [
  {
    name: "FURNITURE",
    subSections: [
      {
        name: "Living Room Furniture",
        items: [
          "All Living Room Furniture",
          "Sofas + Sectional",
          "Chairs",
          "Coffee Tables",
          "Console Tables",
          "Side Tables",
          "Bookcases + Shelvings",
          "Ottomans + Stools",
          "Benches",
          "Media Consoles"
        ]
      },
      {
        name: "Outdoor Furniture",
        items: [
          "All Outdoor Furniture",
          "Outdoor Living Furniture",
          "Outdoor Dining Furniture"
        ]
      },
      {
        name: "Bedroom Furniture",
        items: [
          "All Bedroom Furniture",
          "Bed",
          "Bedside Tables",
          "Dressers",
          "Benches"
        ]
      },
      {
        name: "Dining Room Furniture",
        items: [
          "All Dining Room Furniture",
          "Dining Bench + Stools",
          "Dining Chairs",
          "Dining Storage",
          "Dining Tables"
        ]
      },
      {
        name: "Home Office Furniture",
        items: [
          "All Home Office Furniture",
          "Bookcases + Shelvings",
          "Desks + Chairs"
        ]
      },
      {
        name: "Storage Furniture",
        items: [
          "All Storage Furniture",
          "Entryway Furniture"
        ]
      },
      {
        name: "Collections",
        items: [
          "Anton Collection",
          "Mid-Century Collection",
          "Pierce & Ward Collection",
          "New Arrivals",
          "Emma Chamberlain Collection"
        ]
      },
      {
        name: "In-Stock & Ready To Ship"
      }
    ]
  },
  {
    name: "OUTDOOR & GARDEN",
    subSections: [
      {
        name: "Outdoor Furniture",
        items: [
          "All Outdoor Furniture",
          "Outdoor Living Furniture",
          "Outdoor Dining Furniture"
        ]
      },
      {
        name: "Garden",
        items: [
          "All Garden",
          "Faux Plants + Flowers",
          "Indoor Planters",
          "Outdoor Planters"
        ]
      },
      {
        name: "Outdoor Accessories & Decor",
        items: [
          "All Outdoor Accessories & Decor",
          "Outdoor Pillows"
        ]
      }
    ]
  },
  {
    name: "BEDDING & BATH",
    subSections: [
      {
        name: "Bedding By Material",
        items: [
          "Cotton",
          "Linen",
          "Velvet"
        ]
      },
      {
        name: "Bed Linen",
        items: [
          "All Bed Linen",
          "Blankets",
          "Duvets",
          "Quilts + Coverlets",
          "Sheet Sets"
        ]
      },
      {
        name: "Bath Linen & Accessories",
        items: [
          "All Bath Linen & Accessories",
          "Towels",
          "Bath Mats",
          "Bath Accessories"
        ]
      },
      {
        name: "Bedding Essentials",
        items: [
          "Pillow Inserts",
          "Duvet Inserts"
        ]
      }
    ]
  },
  {
    name: "PILLOWS & DECOR",
    subSections: [
      {
        name: "Pillows & Throws",
        items: [
          "All Pillows & Throws",
          "Pillow Covers",
          "Throws",
          "Pillow Inserts",
          "Pouffs"
        ]
      },
      {
        name: "Planters & Botanicals",
        items: [
          "All Planters + Botanicals",
          "Indoor Planters",
          "Outdoor Planters"
        ]
      },
      {
        name: "Room Decor",
        items: [
          "All Room Décor",
          "Vases",
          "Lanterns + Candle Holders",
          "Decorative Objects + Sculptures",
          "Baskets + Hampers",
          "Candles + Diffusers",
          "Jewellery + Display Boxes"
        ]
      }
    ]
  },
  {
    name: "KITCHEN & DINING",
    subSections: [
      {
        name: "Dinnerware",
        items: [
          "All Dinnerware",
          "Bowls",
          "Dinner Plates",
          "Mugs",
          "Salad Plates"
        ]
      },
      {
        name: "Serveware",
        items: [
          "All Serveware",
          "Serving Platters & Bowls",
          "Charcuterie Boards And Knives",
          "Trays & Bakeware",
          "Salt & Pepper Shakers",
          "Dessert Stands"
        ]
      },
      {
        name: "Flatware",
        items: [
          "All Flatware"
        ]
      },
      {
        name: "Bar + Glassware",
        items: [
          "All Bar Accessories",
          "Bar Accessories + Decanters",
          "Coasters",
          "Glassware + Stemware"
        ]
      },
      {
        name: "Table Linen",
        items: [
          "All Table Linen",
          "Napkins + Napkin Rings",
          "Placemats + Runners"
        ]
      }
    ]
  },
  {
    name: "LIGHTING",
    subSections: [
      {
        name: "Ceiling Lighting",
        items: [
          "All Ceiling Lighting",
          "Chandeliers",
          "Pendants"
        ]
      },
      {
        name: "Table + Floor Lamp",
        items: [
          "All Table + Floor Lamp",
          "Floor Lamps",
          "Table Lamps"
        ]
      }
    ]
  },
  {
    name: "RUGS",
    subSections: [
      {
        name: "Rugs by Category",
        items: [
          "Patterned Rugs",
          "Solid Rugs",
          "Wool Rugs",
          "Tencel Rugs"
        ]
      }
    ]
  },
  {
    name: "ART & MIRRORS",
    subSections: [
      {
        name: "Mirrors",
        items: [
          "All Mirrors"
        ]
      },
      {
        name: "Picture Frames",
        items: [
          "All Picture Frames"
        ]
      },
      {
        name: "Wall Art",
        items: [
          "All Wall Art"
        ]
      }
    ]
  },
  {
    name: "GIFTS",
    subSections: [
      {
        name: "Gifts By Category",
        items: [
          "Vases",
          "Dinnerware",
          "Side Tables",
          "Serveware",
          "Candles",
          "Planters",
          "Lightings",
          "Picture Frames"
        ]
      },
      {
        name: "Gifts By Price",
        items: [
          "Gifts Under Rs 5000",
          "Gifts Under Rs 10000",
          "Gifts Under Rs 15000",
          "Gifts Above Rs 20000"
        ]
      },
      {
        name: "Gifts By Occasion",
        items: [
          "Gifts & Hampers",
          "Wedding Gifts",
          "House Warming Gifts"
        ]
      },
      {
        name: "Gifts By Recipients",
        items: [
          "Gifts For Her",
          "Gifts For Him",
          "Gifts For Hosts"
        ]
      }
    ]
  },
  {
    name: "SALE",
    subSections: [
      {
        name: "All Sale",
        items: [
          "Furniture",
          "Dining Furniture",
          "Bedroom Furniture",
          "Decor",
          "Bedding",
          "Pillows & Throws",
          "Rugs"
        ]
      },
      {
        name: "Open Box Deal"
      }
    ]
  }
];

// Map the raw dry configuration into the final strictly-typed NAVIGATION_DATA array
export const NAVIGATION_DATA: Section[] = RAW_NAVIGATION_TREE.map((section, secIdx) => {
  const sectionSlug = slugify(section.name);
  return {
    id: `nav-section-${secIdx}`,
    name: section.name,
    slug: sectionSlug,
    href: `/shop/${sectionSlug}`,
    children: section.subSections.map((sub, subIdx) => {
      const subSlug = slugify(sub.name);
      return {
        name: sub.name,
        slug: subSlug,
        href: `/shop/${sectionSlug}/${subSlug}`,
        children: (sub.items || []).map((item) => {
          const itemSlug = slugify(item);
          return {
            name: item,
            slug: itemSlug,
            href: `/shop/${sectionSlug}/${subSlug}/${itemSlug}`
          };
        })
      };
    })
  };
});
