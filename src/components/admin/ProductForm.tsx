"use client";

import React, { useState, useEffect, useRef } from "react";
import { getCategoriesAction, createProductAction } from "@/app/admin/actions";
import { 
  Plus, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle,
  FileText,
  DollarSign,
  Tag,
  FolderOpen,
  Layers,
  Upload,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Settings,
  Scale,
  Sparkle
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ThumbnailProps {
  file: File;
  onRemove: () => void;
}

// Optimized preview thumbnail with mount/unmount URL cleanup to prevent memory leaks
function ImageThumbnail({ file, onRemove }: ThumbnailProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!previewUrl) return null;

  return (
    <div className="relative group w-20 h-20 border border-neutral-200 rounded overflow-hidden shadow-sm bg-neutral-100 flex-shrink-0 animate-fadeIn transition duration-300 hover:border-[#a15c38]">
      <img
        src={previewUrl}
        alt={file.name}
        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center">
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition shadow-md"
          title="Remove Image"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="absolute bottom-0 inset-x-0 bg-[#222222]/80 text-[8px] text-white px-1 py-0.5 truncate text-center font-mono">
        {(file.size / (1024 * 1024)).toFixed(2)} MB
      </div>
    </div>
  );
}

export default function ProductForm() {
  // --- Category & Loading State ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  // --- Form Input States (Product Level directly mapped to MySQL Schema) ---
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sku, setSku] = useState("");
  const [inventory, setInventory] = useState("10");
  const [basePrice, setBasePrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [careInstructions, setCareInstructions] = useState("");

  // --- SEO Metadata States ---
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [seoOpen, setSeoOpen] = useState(false); // SEO Accordion toggle

  // --- Images Drag-and-Drop Uploader States ---
  const [images, setImages] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- UX Feedback & Submission States ---
  const [submitting, setSubmitting] = useState(false);
  const [successResponse, setSuccessResponse] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // --- Fetch categories from Laravel API on mount, fallback gracefully to server action if offline ---
  useEffect(() => {
    async function loadCategories() {
      setCategoriesLoading(true);
      try {
        console.log("Attempting category index retrieval from Laravel backend...");
        const response = await fetch("http://localhost:8000/api/categories", {
          headers: {
            "Accept": "application/json",
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.categories) {
            console.log("Successfully connected to Laravel API! Categories loaded dynamically.");
            // Normalize IDs to string to fit interface
            const formatted = data.categories.map((c: any) => ({
              id: String(c.id),
              name: c.name,
              slug: c.slug
            }));
            setCategories(formatted);
            if (formatted.length > 0) {
              setCategoryId(formatted[0].id);
            }
            setCategoriesLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Laravel backend API categories offline. Redirecting query to PostgreSQL Server Actions...", err);
      }

      // Revert to Next.js local Server Action
      const res = await getCategoriesAction();
      if (res.success && res.categories) {
        setCategories(res.categories);
        if (res.categories.length > 0) {
          setCategoryId(res.categories[0].id);
        }
      } else {
        setCategoriesError("Failed to fetch categories. Sandbox categories will apply.");
      }
      setCategoriesLoading(false);
    }
    loadCategories();
  }, []);

  // --- Drag and Drop File Handlers ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (incomingFiles: File[]) => {
    const imageFiles = incomingFiles.filter(file => file.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      alert("Invalid selection: Please upload image files only (JPG, PNG, WEBP).");
      return;
    }

    setImages(prev => {
      const combined = [...prev, ...imageFiles];
      if (combined.length > 10) {
        alert("Upload constraints: You cannot upload more than 10 images concurrently.");
        return combined.slice(0, 10);
      }
      return combined;
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // --- Helper to programmatically construct 1x1 transparent PNG files for fast seeding ---
  const createMockFile = (name: string, type = "image/png"): File => {
    const base64Content = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const raw = window.atob(base64Content);
    const rawLength = raw.length;
    const u8Arr = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; i++) {
      u8Arr[i] = raw.charCodeAt(i);
    }
    const blob = new Blob([u8Arr], { type });
    return new File([blob], name, { type });
  };

  // --- Templates for Quick Seeding ---
  const loadPresetTemplate = (type: "sofa" | "bed" | "bath") => {
    setSuccessResponse(null);
    setErrorMessage("");

    // Inject 5 mock files to pass Laravel API's array limits and ensure high-fidelity testing
    const mockFiles = [
      createMockFile(`${type}_primary_cover.png`),
      createMockFile(`${type}_alternative_angle.png`),
      createMockFile(`${type}_architectural_details.png`),
      createMockFile(`${type}_lifestyle_render.png`),
      createMockFile(`${type}_material_swatch.png`),
    ];
    setImages(mockFiles);

    if (type === "sofa") {
      const furnitureCat = categories.find(c => c.name.toLowerCase() === "furniture") || categories[0];
      setTitle("Mid-Century Haven Sectional Sofa");
      setCategoryId(furnitureCat?.id || "");
      setSku(`WE-FUR-HAVEN-${Math.floor(1000 + Math.random() * 9000)}`);
      setInventory("12");
      setBasePrice("124999");
      setDiscountPrice("109999");
      setShortDescription("Expansive deep cushions, solid mahogany base, and ultra-plush tactile velvet wrap.");
      setLongDescription("Defined by its expansive deep cushions, solid mahogany base, and ultra-plush tactile velvet wrap. The Haven Sectional represents editorial luxury, tailored comfort, and modern sophistication for premium living spaces.");
      setDimensions("72\"w x 38\"d x 34\"h");
      setCareInstructions("Professional cleaning recommended. Vacuum regularly with upholstery brush attachment.");
      setMetaTitle("Mid-Century Haven Sectional Sofa | West Elm India");
      setMetaDescription("Shop the Mid-Century Haven Sectional Sofa in luxurious Royal Velvet with deep, comfortable cushions and high-end mahogany base wood support details.");
    } else if (type === "bed") {
      const beddingCat = categories.find(c => c.name.toLowerCase() === "bedding") || categories[0];
      setTitle("Premium Organic Belgian Flax Bed Set");
      setCategoryId(beddingCat?.id || "");
      setSku(`WE-BED-BELGIAN-${Math.floor(1000 + Math.random() * 9000)}`);
      setInventory("25");
      setBasePrice("18999");
      setDiscountPrice("16499");
      setShortDescription("Loomed from high-grade French organic flax and pre-washed for exquisite tactile softness.");
      setLongDescription("Loomed from high-grade French organic flax and pre-washed for exquisite softness. Highly breathable, durable, and naturally thermal-regulating, this organic bedding set creates an unmatched sleeping sanctuary.");
      setDimensions("Queen: 90\"w x 92\"l; King: 108\"w x 92\"l");
      setCareInstructions("Machine wash warm, gentle cycle. Tumble dry low. Do not bleach. Warm iron if desired.");
      setMetaTitle("Organic Belgian Flax Linen Sheet Set | West Elm India");
      setMetaDescription("Indulge in breathable, organic Belgian flax sheets. Pre-washed for optimal softness and naturally thermal-regulating comfort all year long.");
    } else if (type === "bath") {
      const bathCat = categories.find(c => c.name.toLowerCase() === "bath") || categories[0];
      setTitle("Handcrafted Terrazzo Vanity Tray Set");
      setCategoryId(bathCat?.id || "");
      setSku(`WE-BTH-TERRAZZO-${Math.floor(1000 + Math.random() * 9000)}`);
      setInventory("40");
      setBasePrice("4999");
      setDiscountPrice("");
      setShortDescription("Infuse structural, organic elegance into your master bath coordinates.");
      setLongDescription("Infuse structural, organic elegance into your master bath coordinates. Made from heavy speckle composite terrazzo stone and solid concrete base, this premium set adds high-fidelity texture to your morning routines.");
      setDimensions("Tray: 12\"w x 6\"d x 1\"h; Dispenser: 3\"diam. x 7\"h");
      setCareInstructions("Wipe clean with a soft, damp cloth. Avoid harsh chemical cleaners or abrasive pads.");
      setMetaTitle("Terrazzo Bathroom Accessories Set | West Elm India");
      setMetaDescription("Discover our handcrafted terrazzo stone vanity trays and bathroom accessories, bringing high-fidelity texture and premium architectural style to your bath.");
    }
  };

  // --- Form Submission Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    setSuccessResponse(null);

    // Enforce files count bounds
    if (images.length === 0) {
      setErrorMessage("Form Submission Blocked: You must select or drop at least 1 product image to proceed.");
      setSubmitting(false);
      return;
    }

    // Build FormData object for multipart/form-data ingestion matching Laravel Controller API exactly
    const formData = new FormData();
    formData.append("category_id", categoryId);
    formData.append("title", title.trim());
    formData.append("short_description", shortDescription.trim());
    formData.append("long_description", longDescription.trim());
    formData.append("dimensions", dimensions.trim());
    formData.append("care_instructions", careInstructions.trim());
    formData.append("base_price", basePrice.trim());
    formData.append("sku", sku.trim().toUpperCase());
    formData.append("inventory", inventory.trim());

    if (discountPrice.trim()) {
      formData.append("discount_price", discountPrice.trim());
    }
    if (metaTitle.trim()) {
      formData.append("meta_title", metaTitle.trim());
    }
    if (metaDescription.trim()) {
      formData.append("meta_description", metaDescription.trim());
    }

    // Append images
    images.forEach((file) => {
      formData.append("images[]", file);
    });

    try {
      console.log("Sending multipart product form submission directly to Laravel API...");
      const response = await fetch("http://localhost:8000/api/admin/products", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok && data.success) {
        console.log("Laravel API accepted submission! Product successfully created in MySQL database.");
        setSuccessResponse({
          ...data,
          isMock: false
        });

        // Scroll to success screen
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Reset Form Fields
        setTitle("");
        setSku("");
        setInventory("10");
        setBasePrice("");
        setDiscountPrice("");
        setShortDescription("");
        setLongDescription("");
        setDimensions("");
        setCareInstructions("");
        setMetaTitle("");
        setMetaDescription("");
        setImages([]);
      } else {
        if (data.errors) {
          // Format Laravel Validation Errors nicely
          const errorList = Object.entries(data.errors)
            .map(([field, errs]: any) => `${field.toUpperCase()}: ${errs.join(" ")}`)
            .join(" | ");
          setErrorMessage(errorList || "Validation failed on the Laravel API.");
        } else {
          setErrorMessage(data.error || data.message || "An error occurred on the Laravel API.");
        }
      }
    } catch (err: any) {
      console.warn("Laravel API server offline. Reverting to Prisma Server Action fallback...", err);
      
      // Construct single transaction package for local PostgreSQL Prisma action
      const payload = {
        title: title.trim(),
        description: longDescription.trim() || shortDescription.trim(),
        basePrice: basePrice.trim(),
        discountPrice: discountPrice.trim() || null,
        categoryId,
        variants: [
          {
            colorName: "Standard (Prisma Sandbox)",
            colorHex: "#222222",
            sku: sku.trim().toUpperCase(),
            stock: inventory.trim(),
            imageUrls: [
              "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
            ],
          }
        ]
      };

      const res = await createProductAction(payload);
      if (res.success && res.product) {
        setSuccessResponse({
          success: true,
          message: "Laravel API was offline. Next.js Sandbox Simulation fell back perfectly.",
          isMock: true,
          product: {
            id: res.product.id,
            title: res.product.title,
            slug: res.product.slug,
            sku: sku.toUpperCase(),
            inventoryCount: res.product.inventoryCount || inventory,
          }
        });
        
        // Scroll to success screen
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Reset Fields
        setTitle("");
        setSku("");
        setInventory("10");
        setBasePrice("");
        setDiscountPrice("");
        setShortDescription("");
        setLongDescription("");
        setDimensions("");
        setCareInstructions("");
        setMetaTitle("");
        setMetaDescription("");
        setImages([]);
      } else {
        setErrorMessage(res.error || "Sandbox error: Unable to complete seed process through fallback server action.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative font-sans text-neutral-800">
      {/* Fullscreen Submitting Overlay (Glassmorphism & West Elm Aesthetics) */}
      {submitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white">
          <div className="bg-[#1c1c1c] border border-neutral-800 p-8 rounded shadow-2xl flex flex-col items-center max-w-sm text-center">
            <Loader2 className="w-12 h-12 text-[#a15c38] animate-spin mb-4" />
            <h3 className="text-lg font-serif tracking-wider mb-2 uppercase">Injecting E-Commerce Data</h3>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Writing parameters, uploading multi-resolution images, mapping category indexes, and compiling SQL transactions...
            </p>
          </div>
        </div>
      )}

      {/* Header Panel */}
      <div className="mb-8 border-b border-neutral-200 pb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif text-neutral-900 tracking-wide">Product Management Hub</h2>
          <p className="text-neutral-500 text-xs mt-1">
            Build premium high-density products with multipart asset uploaders integrated into Laravel endpoints.
          </p>
        </div>
        
        {/* Rapid Seed Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-neutral-400 uppercase tracking-widest mr-2 flex items-center gap-1 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#a15c38]" /> Quick-Seed Presets:
          </span>
          <button
            type="button"
            onClick={() => loadPresetTemplate("sofa")}
            className="px-3.5 py-2 bg-neutral-100 hover:bg-[#a15c38]/10 hover:text-[#a15c38] border border-neutral-200 hover:border-[#a15c38]/30 text-[10px] tracking-wider uppercase rounded transition duration-200 cursor-pointer font-medium"
          >
            Sofa
          </button>
          <button
            type="button"
            onClick={() => loadPresetTemplate("bed")}
            className="px-3.5 py-2 bg-neutral-100 hover:bg-[#a15c38]/10 hover:text-[#a15c38] border border-neutral-200 hover:border-[#a15c38]/30 text-[10px] tracking-wider uppercase rounded transition duration-200 cursor-pointer font-medium"
          >
            Bed Set
          </button>
          <button
            type="button"
            onClick={() => loadPresetTemplate("bath")}
            className="px-3.5 py-2 bg-neutral-100 hover:bg-[#a15c38]/10 hover:text-[#a15c38] border border-neutral-200 hover:border-[#a15c38]/30 text-[10px] tracking-wider uppercase rounded transition duration-200 cursor-pointer font-medium"
          >
            Bath Set
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successResponse && (
        <div className="mb-8 p-6 bg-[#faf8f5] border border-[#a15c38]/30 rounded flex gap-4 animate-fadeIn">
          <div className="text-[#a15c38] shrink-0 mt-1">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm uppercase tracking-widest text-[#a15c38] font-bold flex items-center gap-1.5">
              Product Ingestion Success
              <Sparkle className="w-3.5 h-3.5 text-[#a15c38] fill-current" />
            </h4>
            <p className="text-neutral-600 text-xs leading-relaxed">
              {successResponse.message}
            </p>
            {successResponse.isMock && (
              <div className="inline-block px-2.5 py-0.5 bg-[#a15c38]/10 text-[#a15c38] text-[9px] uppercase tracking-widest rounded font-semibold">
                Sandbox Simulation Active
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-neutral-200 text-xs text-neutral-500 space-y-1">
              <div><strong className="text-neutral-700">MySQL Primary Key:</strong> {successResponse.product.id}</div>
              <div><strong className="text-neutral-700">Product Title:</strong> {successResponse.product.title}</div>
              <div><strong className="text-neutral-700">Generated URL Slug:</strong> <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-800 font-mono text-[10px]">{successResponse.product.slug}</code></div>
              <div><strong className="text-neutral-700">SKU Warehousing Code:</strong> <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-800 font-mono text-[10px]">{successResponse.product.sku}</code></div>
              {successResponse.product.images && successResponse.product.images.length > 0 && (
                <div className="pt-2">
                  <strong className="text-neutral-700 block mb-1">Stored Assets:</strong>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {successResponse.product.images.map((url: string, i: number) => (
                      <a 
                        key={i} 
                        href={url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[10px] text-[#a15c38] underline hover:text-[#894b2c] block truncate max-w-[200px]"
                      >
                        Image #{i + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-800 rounded flex gap-3 text-xs leading-relaxed animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="w-full">
            <strong className="font-bold uppercase tracking-wider block mb-1">Execution Interrupted</strong>
            <p className="whitespace-pre-line">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Core Injection Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Product Metadata Details (2/3 Width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Core Information Section */}
          <section className="bg-white p-6 border border-neutral-200 rounded space-y-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
              <FileText className="w-5 h-5 text-neutral-500" />
              <h3 className="text-xs font-serif tracking-wider text-neutral-900 uppercase">1. Core Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="prod-title" className="text-[10px] font-bold tracking-wider text-neutral-700 uppercase">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="prod-title"
                  name="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Haven Sectional Sofa"
                  className="px-4 py-2.5 bg-white border border-neutral-300 rounded text-sm focus:outline-none focus:border-[#a15c38] focus:ring-1 focus:ring-[#a15c38] transition placeholder:text-neutral-400"
                />
              </div>

              {/* Category selector */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="prod-category" className="text-[10px] font-bold tracking-wider text-neutral-700 uppercase">
                  Category <span className="text-red-500">*</span>
                </label>
                {categoriesLoading ? (
                  <div className="h-10 bg-neutral-50 border border-neutral-200 rounded flex items-center px-4 text-xs text-neutral-400 gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#a15c38]" /> Fetching Laravel index list...
                  </div>
                ) : (
                  <select
                    id="prod-category"
                    name="categoryId"
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="px-4 py-2.5 bg-white border border-neutral-300 rounded text-sm focus:outline-none focus:border-[#a15c38] focus:ring-1 focus:ring-[#a15c38] transition appearance-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} {cat.slug ? `(${cat.slug})` : ""}
                      </option>
                    ))}
                  </select>
                )}
                {categoriesError && (
                  <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {categoriesError}
                  </p>
                )}
              </div>
            </div>

            {/* Short Description */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="prod-short-desc" className="text-[10px] font-bold tracking-wider text-neutral-700 uppercase">
                Short Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="prod-short-desc"
                name="short_description"
                required
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="A concise, high-impact overview summarizing material and key premium features..."
                className="px-4 py-2.5 bg-white border border-neutral-300 rounded text-sm focus:outline-none focus:border-[#a15c38] focus:ring-1 focus:ring-[#a15c38] transition resize-y min-h-[60px] placeholder:text-neutral-400"
              />
            </div>

            {/* Long Description */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="prod-long-desc" className="text-[10px] font-bold tracking-wider text-neutral-700 uppercase">
                Detailed Long Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="prod-long-desc"
                name="long_description"
                required
                rows={5}
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                placeholder="A full comprehensive overview detailing the architectural craftsmanship, design cues, raw material quality, and high-fidelity room styling suggestions..."
                className="px-4 py-2.5 bg-white border border-neutral-300 rounded text-sm focus:outline-none focus:border-[#a15c38] focus:ring-1 focus:ring-[#a15c38] transition resize-y min-h-[120px] placeholder:text-neutral-400"
              />
            </div>

            {/* Dimensions & Care Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dimensions */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="prod-dimensions" className="text-[10px] font-bold tracking-wider text-neutral-700 uppercase">
                  Physical Dimensions <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    id="prod-dimensions"
                    name="dimensions"
                    required
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="e.g. 72&quot;w x 38&quot;d x 34&quot;h"
                    className="pl-9 pr-4 py-2.5 bg-white border border-neutral-300 rounded text-sm w-full focus:outline-none focus:border-[#a15c38] focus:ring-1 focus:ring-[#a15c38] transition placeholder:text-neutral-400 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Care Instructions */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="prod-care" className="text-[10px] font-bold tracking-wider text-neutral-700 uppercase">
                  Care & Maintenance Instructions <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="prod-care"
                  name="care_instructions"
                  required
                  rows={2}
                  value={careInstructions}
                  onChange={(e) => setCareInstructions(e.target.value)}
                  placeholder="e.g. Vacuum regularly. Upholstery cleaner spot treatments..."
                  className="px-4 py-2 bg-white border border-neutral-300 rounded text-xs focus:outline-none focus:border-[#a15c38] focus:ring-1 focus:ring-[#a15c38] transition placeholder:text-neutral-400 resize-y min-h-[44px]"
                />
              </div>
            </div>
          </section>

          {/* SEO Metadata Section (Accordion) */}
          <section className="bg-white border border-neutral-200 rounded shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setSeoOpen(!seoOpen)}
              className="w-full flex items-center justify-between p-6 bg-neutral-50/50 hover:bg-neutral-50 border-b border-neutral-200 transition text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-neutral-500" />
                <div>
                  <h3 className="text-xs font-serif tracking-wider text-neutral-900 uppercase">2. Google SEO Meta Customization</h3>
                  <p className="text-[10px] text-neutral-400 font-sans mt-0.5">Define indexing titles and descriptions mapping target limits</p>
                </div>
              </div>
              {seoOpen ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
            </button>

            {seoOpen && (
              <div className="p-6 space-y-6 animate-fadeIn">
                {/* Meta Title */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="prod-meta-title" className="text-[10px] font-bold tracking-wider text-neutral-700 uppercase">
                      SEO Meta Title
                    </label>
                    <span className={`text-[10px] font-mono ${metaTitle.length > 60 ? 'text-red-500 font-bold' : 'text-neutral-400'}`}>
                      {metaTitle.length}/60 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    id="prod-meta-title"
                    name="meta_title"
                    maxLength={100}
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="e.g. Luxury Sectional Haven Sofa | West Elm India"
                    className="px-4 py-2.5 bg-white border border-neutral-300 rounded text-sm focus:outline-none focus:border-[#a15c38] focus:ring-1 focus:ring-[#a15c38] transition placeholder:text-neutral-400 text-xs"
                  />
                  <p className="text-[9px] text-neutral-400">Best practice: Keep titles under 60 characters to avoid SERP cuts.</p>
                </div>

                {/* Meta Description */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="prod-meta-desc" className="text-[10px] font-bold tracking-wider text-neutral-700 uppercase">
                      SEO Meta Description
                    </label>
                    <span className={`text-[10px] font-mono ${metaDescription.length > 160 ? 'text-red-500 font-bold' : 'text-neutral-400'}`}>
                      {metaDescription.length}/160 chars
                    </span>
                  </div>
                  <textarea
                    id="prod-meta-desc"
                    name="meta_description"
                    rows={3}
                    maxLength={250}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="e.g. Elevate your room aesthetics with our signature Mid-Century Haven Sectional Sofa, built from premium mahogany wood structures and tactile plush velvet..."
                    className="px-4 py-2.5 bg-white border border-neutral-300 rounded text-xs focus:outline-none focus:border-[#a15c38] focus:ring-1 focus:ring-[#a15c38] transition placeholder:text-neutral-400 resize-y min-h-[60px]"
                  />
                  <p className="text-[9px] text-neutral-400">Best practice: Limit description text to 160 characters for complete search snippets.</p>
                </div>
              </div>
            )}
          </section>

        </div>

        {/* RIGHT COLUMN: Media uploads, Pricing and Submission (1/3 Width) */}
        <div className="space-y-8">
          
          {/* Media Assets Upload */}
          <section className="bg-white p-6 border border-neutral-200 rounded shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
              <ImageIcon className="w-5 h-5 text-neutral-500" />
              <h3 className="text-xs font-serif tracking-wider text-neutral-900 uppercase">3. Media Gallery</h3>
            </div>

            <p className="text-[10px] text-neutral-400 leading-normal">
              Select or drag and drop up to 10 high-resolution images. Multi-image arrays will save in Laravel's file storage.
            </p>

            {/* Interactive Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 min-h-[140px] ${
                dragOver 
                  ? "border-[#a15c38] bg-[#a15c38]/5 scale-[0.98] shadow-inner" 
                  : "border-neutral-300 hover:border-[#a15c38] hover:bg-neutral-50"
              }`}
            >
              <Upload className={`w-8 h-8 transition-colors ${dragOver ? "text-[#a15c38]" : "text-neutral-400"}`} />
              <div>
                <span className="text-xs font-semibold text-neutral-700 block">Click to select files</span>
                <span className="text-[9px] text-neutral-400 block mt-1">or drag & drop images here</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Dynamic Thumbnails Preview Grid */}
            {images.length > 0 && (
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    Selected Assets ({images.length}/10)
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setImages([])} 
                    className="text-[9px] text-red-500 font-semibold hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                  {images.map((file, idx) => (
                    <ImageThumbnail
                      key={`${file.name}-${idx}`}
                      file={file}
                      onRemove={() => removeImage(idx)}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Pricing, SKU and Stock Card */}
          <section className="bg-white p-6 border border-neutral-200 rounded shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
              <DollarSign className="w-5 h-5 text-neutral-500" />
              <h3 className="text-xs font-serif tracking-wider text-neutral-900 uppercase">4. Pricing & Warehousing</h3>
            </div>

            {/* Base Price */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="prod-base-price" className="text-[10px] font-bold tracking-wider text-neutral-700 uppercase">
                Base MSRP Price (₹ INR) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-serif text-sm">₹</span>
                <input
                  type="text"
                  id="prod-base-price"
                  name="basePrice"
                  required
                  inputMode="numeric"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value.replace(/\D/g, ""))}
                  placeholder="89999"
                  className="pl-8 pr-4 py-2.5 bg-white border border-neutral-300 rounded text-sm w-full focus:outline-none focus:border-[#a15c38] focus:ring-1 focus:ring-[#a15c38] transition font-bold text-neutral-800"
                />
              </div>
            </div>

            {/* Discount Price */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="prod-discount-price" className="text-[10px] font-bold tracking-wider text-neutral-700 uppercase">
                Promotional Markdown (₹ INR - Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-serif text-sm">₹</span>
                <input
                  type="text"
                  id="prod-discount-price"
                  name="discountPrice"
                  inputMode="numeric"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value.replace(/\D/g, ""))}
                  placeholder="Markdown Price (< Base MSRP)"
                  className="pl-8 pr-4 py-2.5 bg-white border border-neutral-300 rounded text-sm w-full focus:outline-none focus:border-[#a15c38] focus:ring-1 focus:ring-[#a15c38] transition font-bold text-emerald-800"
                />
              </div>
            </div>

            {/* SKU and Inventory Row */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="prod-sku" className="text-[10px] font-bold tracking-wider text-neutral-700 uppercase">
                  SKU Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="prod-sku"
                  name="sku"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="WE-FUR-SOFA"
                  className="px-3 py-2 bg-white border border-neutral-300 rounded text-xs focus:outline-none focus:border-[#a15c38] focus:ring-1 focus:ring-[#a15c38] transition font-mono uppercase font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="prod-inventory" className="text-[10px] font-bold tracking-wider text-neutral-700 uppercase">
                  Stock Units <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="prod-inventory"
                  name="inventory"
                  required
                  inputMode="numeric"
                  value={inventory}
                  onChange={(e) => setInventory(e.target.value.replace(/\D/g, ""))}
                  placeholder="10"
                  className="px-3 py-2 bg-white border border-neutral-300 rounded text-xs focus:outline-none focus:border-[#a15c38] focus:ring-1 focus:ring-[#a15c38] transition font-bold font-mono"
                />
              </div>
            </div>
          </section>

          {/* Submission and Sandbox Hook */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#a15c38] hover:bg-[#894b2c] text-white text-xs font-bold uppercase tracking-widest rounded shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Ingesting Data...
                </>
              ) : (
                "Create Product & Inject API"
              )}
            </button>
            <p className="text-[9px] text-center text-neutral-400 mt-2 leading-relaxed">
              Submits directly to standard Laravel API endpoints. Automatically switches to Next.js fallback operations if the PHP service is offline.
            </p>
          </div>

        </div>

      </form>
    </div>
  );
}

