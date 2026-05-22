"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FolderPlus, Trash2, ChevronRight, Layers, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  depth: number;
  children?: Category[];
}

export default function AdminCategoriesPage() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [parentCandidates, setParentCandidates] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string>("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
        setParentCandidates(data.parentCandidates || []);
      } else {
        setError("Failed to fetch administrative category tree.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Network error connecting to Laravel server. Make sure php artisan serve is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${API_URL}/api/admin/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          parent_id: parentId ? parseInt(parentId) : null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(data.message || `Category "${name}" created successfully.`);
        setName("");
        setParentId("");
        fetchCategories();
      } else {
        setError(data.message || "Failed to create category.");
      }
    } catch (err) {
      setError("Error sending request to Laravel server.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category? All its nested sub-categories will be cascading deleted permanently!")) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${API_URL}/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(data.message || "Category successfully deleted.");
        fetchCategories();
      } else {
        setError(data.message || "Failed to delete category.");
      }
    } catch (err) {
      setError("Error sending delete request to Laravel server.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-[#a15c38] selection:text-white">
      {/* Mini Admin Nav Header */}
      <header className="bg-[#1c1c1c] text-white px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 hover:bg-neutral-800 rounded transition text-neutral-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xs font-serif tracking-widest uppercase">West Elm India</h1>
            <p className="text-[10px] text-[#c2966e] tracking-widest uppercase font-semibold">
              Category Hierarchy Manager
            </p>
          </div>
        </div>
        <button 
          onClick={fetchCategories}
          className="p-2 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded transition cursor-pointer"
          title="Refresh Taxonomy"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        
        {/* Messages Feedback */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded flex items-center gap-2">
            <FolderPlus className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* Form Side - Left Column */}
          <div className="lg:col-span-5 bg-white p-6 md:p-8 border border-neutral-200 rounded shadow-sm self-start">
            <h2 className="text-lg font-serif text-neutral-900 tracking-wide mb-1">Create Category</h2>
            <p className="text-neutral-500 text-[11px] uppercase tracking-wider mb-6">
              Establish multi-tier database taxonomies
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="category-name" className="block text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-2">
                  Category Name
                </label>
                <input
                  id="category-name"
                  type="text"
                  placeholder="e.g. Living Room, Rugs, Bed Sheets"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#f6f4f0] border border-neutral-200 focus:border-brand-charcoal text-xs py-2.5 px-3 focus:outline-none focus:bg-white transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label htmlFor="parent-category" className="block text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-2">
                  Parent Category (Optional)
                </label>
                <select
                  id="parent-category"
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full bg-[#f6f4f0] border border-neutral-200 focus:border-brand-charcoal text-xs py-2.5 px-3 focus:outline-none focus:bg-white transition-all duration-300"
                >
                  <option value="">[None] Create as Root (Tier 0)</option>
                  
                  {/* Candidates filtering to Tier 0 and 1 */}
                  {parentCandidates.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.depth === 1 ? "  ↳ " : ""}
                      {parent.name} ({parent.depth === 0 ? "Root Tier" : "Sub-Tier"})
                    </option>
                  ))}
                </select>
                <p className="text-neutral-400 text-[10px] mt-1.5 leading-normal">
                  Add sub-categories by nesting underneath a Root Category. Limits up to depth level 2 (Root &gt; Sub &gt; Sub-Sub).
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#a15c38] hover:bg-[#894b2c] text-white text-xs tracking-widest uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Ingestion...</span>
                  </>
                ) : (
                  <>
                    <FolderPlus className="w-4 h-4" />
                    <span>Create Category</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Tree Side - Right Column */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white border border-neutral-200 rounded shadow-sm">
              <div className="p-5 border-b border-neutral-200 bg-neutral-50/50 flex justify-between items-center">
                <h3 className="text-sm font-serif tracking-wider uppercase text-neutral-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#a15c38]" />
                  <span>Taxonomy Hierarchies Tree</span>
                </h3>
                <span className="text-[9px] bg-neutral-200 border border-neutral-300 text-neutral-600 font-mono font-bold px-2 py-0.5 rounded">
                  Max Depth 3
                </span>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-neutral-400 gap-3">
                    <RefreshCw className="w-8 h-8 animate-spin text-[#a15c38]" />
                    <span className="text-xs font-mono">Compiling tree index...</span>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-12 text-neutral-400">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                    <p className="text-xs">No active category taxonomies seeded inside database.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {categories.map((root) => (
                      <div key={root.id} className="border border-neutral-100 rounded p-4 bg-neutral-50/30">
                        {/* ROOT CATEGORY (TIER 0) */}
                        <div className="flex items-center justify-between py-1.5 border-b border-neutral-100/60 pb-2">
                          <div className="flex items-center gap-2 text-neutral-900">
                            <span className="h-2 w-2 rounded-full bg-[#a15c38]" />
                            <span className="text-xs font-semibold uppercase tracking-wider font-display">
                              {root.name}
                            </span>
                            <span className="text-[9px] text-[#a15c38] font-mono font-semibold uppercase bg-[#a15c38]/10 px-1.5 py-0.5 rounded">
                              Root (0)
                            </span>
                          </div>
                          <button
                            onClick={() => handleDelete(root.id)}
                            className="p-1 hover:bg-rose-50 text-neutral-400 hover:text-rose-600 rounded transition cursor-pointer"
                            title="Delete Cascade"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* SUB-CATEGORIES (TIER 1) */}
                        {root.children && root.children.length > 0 && (
                          <div className="pl-6 mt-3 space-y-3 border-l-2 border-dashed border-neutral-200">
                            {root.children.map((sub) => (
                              <div key={sub.id} className="space-y-2">
                                <div className="flex items-center justify-between py-1 border-b border-neutral-100/40">
                                  <div className="flex items-center gap-1.5 text-neutral-700">
                                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                    <span className="text-xs font-medium">{sub.name}</span>
                                    <span className="text-[8px] text-neutral-500 font-mono bg-neutral-100 border border-neutral-200 px-1 py-0.5 rounded uppercase">
                                      Sub (1)
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => handleDelete(sub.id)}
                                    className="p-1 hover:bg-rose-50 text-neutral-400 hover:text-rose-600 rounded transition cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* SUB-SUB-CATEGORIES (TIER 2) */}
                                {sub.children && sub.children.length > 0 && (
                                  <div className="pl-6 space-y-1.5">
                                    {sub.children.map((subSub) => (
                                      <div key={subSub.id} className="flex items-center justify-between py-1 bg-white p-2 rounded border border-neutral-100">
                                        <div className="flex items-center gap-1.5 text-neutral-500">
                                          <span className="h-1 w-1 bg-neutral-400 rounded-full shrink-0" />
                                          <span className="text-xs font-light">{subSub.name}</span>
                                          <span className="text-[8px] text-neutral-400 font-mono italic">
                                            Sub-Sub (2)
                                          </span>
                                        </div>
                                        <button
                                          onClick={() => handleDelete(subSub.id)}
                                          className="p-0.5 hover:bg-rose-50 text-neutral-400 hover:text-rose-600 rounded transition cursor-pointer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
