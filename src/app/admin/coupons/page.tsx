"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  Percent, 
  Tag, 
  Trash2, 
  Calendar, 
  Plus, 
  ArrowLeft, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  HelpCircle,
  Coins
} from "lucide-react";
import Link from "next/link";

interface Coupon {
  id: number;
  code: string;
  type: "fixed" | "percentage";
  value: string | number;
  expiry_date: string;
  is_active: boolean | number;
  created_at: string;
}

export default function AdminCouponsPage() {
  const { data: session } = useSession();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState("");
  const [type, setType] = useState<"fixed" | "percentage">("percentage");
  const [value, setValue] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Enforce today as minimum date selection
  const [minDate, setMinDate] = useState("");
  
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    setMinDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/coupons`);
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      } else {
        setError("Failed to fetch promotional coupons.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Network exception. Verify Laravel server status on Port 8000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !value || !expiryDate) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const cleanCode = code.toUpperCase().trim().replace(/[^A-Z0-9_-]/g, "");

    try {
      const res = await fetch(`${API_URL}/api/admin/coupons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: cleanCode,
          type,
          value: parseFloat(value),
          expiry_date: expiryDate,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(data.message || `Coupon campaign "${cleanCode}" successfully launched.`);
        setCode("");
        setValue("");
        setExpiryDate("");
        setType("percentage");
        fetchCoupons();
      } else {
        setError(data.message || "Failed to establish coupon code rule.");
      }
    } catch (err) {
      setError("Error sending campaign post parameters to Laravel.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to deactivate and delete this active promotional coupon campaign?")) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${API_URL}/api/admin/coupons/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(data.message || "Promotional coupon dropped from active registers.");
        fetchCoupons();
      } else {
        setError(data.message || "Failed to remove coupon code.");
      }
    } catch (err) {
      setError("Error sending coupon delete request to Laravel.");
    }
  };

  const formatDiscount = (type: "fixed" | "percentage", val: string | number) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    if (type === "percentage") {
      return `${num}% Off`;
    }
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-[#a15c38] selection:text-white">
      {/* Mini Header */}
      <header className="bg-[#1c1c1c] text-white px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 hover:bg-neutral-800 rounded transition text-neutral-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xs font-serif tracking-widest uppercase">West Elm India</h1>
            <p className="text-[10px] text-[#c2966e] tracking-widest uppercase font-semibold">
              Campaign Promotions &amp; Coupons
            </p>
          </div>
        </div>
        <button 
          onClick={fetchCoupons}
          className="p-2 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded transition cursor-pointer"
          title="Refresh Registry"
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
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* Form Side - Left Column */}
          <div className="lg:col-span-5 bg-white p-6 md:p-8 border border-neutral-200 rounded shadow-sm self-start">
            <h2 className="text-lg font-serif text-neutral-900 tracking-wide mb-1">Launch Coupon</h2>
            <p className="text-neutral-500 text-[11px] uppercase tracking-wider mb-6">
              Create discount rules for e-commerce checkouts
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label htmlFor="coupon-code" className="block text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-2">
                  Promo Code (Alpha-Numeric)
                </label>
                <input
                  id="coupon-code"
                  type="text"
                  placeholder="e.g. SUMMER50, FESTIVE15"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-[#f6f4f0] border border-neutral-200 focus:border-brand-charcoal text-xs py-2.5 px-3 focus:outline-none focus:bg-white font-mono font-bold uppercase transition-all duration-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="discount-type" className="block text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-2">
                    Type
                  </label>
                  <select
                    id="discount-type"
                    value={type}
                    onChange={(e) => setType(e.target.value as "fixed" | "percentage")}
                    className="w-full bg-[#f6f4f0] border border-neutral-200 focus:border-brand-charcoal text-xs py-2.5 px-3 focus:outline-none focus:bg-white transition-all duration-300"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Cash (₹)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="discount-value" className="block text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-2">
                    {type === "percentage" ? "Percentage Off (%)" : "Flat Amount (₹)"}
                  </label>
                  <input
                    id="discount-value"
                    type="number"
                    step="0.01"
                    placeholder={type === "percentage" ? "e.g. 15" : "e.g. 5000"}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full bg-[#f6f4f0] border border-neutral-200 focus:border-brand-charcoal text-xs py-2.5 px-3 focus:outline-none focus:bg-white transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="expiry-date" className="block text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-2">
                  Campaign Expiry Calendar
                </label>
                <div className="relative">
                  <input
                    id="expiry-date"
                    type="date"
                    min={minDate}
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-[#f6f4f0] border border-neutral-200 focus:border-brand-charcoal text-xs py-2.5 px-3 focus:outline-none focus:bg-white transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#a15c38] hover:bg-[#894b2c] text-white text-xs tracking-widest uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deploying Promo Code...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Launch Campaign Coupon</span>
                  </>
                )}
              </button>
            </form>

            {/* In-app Guide */}
            <div className="mt-8 p-4 bg-amber-50/50 border border-amber-200 rounded text-neutral-600 text-[11px] leading-relaxed space-y-2">
              <span className="font-bold uppercase tracking-wider text-[9px] text-[#a15c38] flex items-center gap-1">
                <HelpCircle className="w-3 h-3" /> Coupon Redemption Rules
              </span>
              <p>
                Coupon parameters are automatically enforced during customer checkouts. Code entries must match exact case. Percentage coupons are strictly bounded between 1% and 100%.
              </p>
            </div>
          </div>

          {/* List Side - Right Column */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white border border-neutral-200 rounded shadow-sm">
              <div className="p-5 border-b border-neutral-200 bg-neutral-50/50 flex justify-between items-center">
                <h3 className="text-sm font-serif tracking-wider uppercase text-neutral-900 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-[#a15c38]" />
                  <span>Deployed Promo Codes Registry</span>
                </h3>
                <span className="text-[9px] bg-neutral-200 border border-neutral-300 text-neutral-600 font-mono font-bold px-2 py-0.5 rounded">
                  {coupons.length} Rules Deployed
                </span>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-neutral-400 gap-3">
                    <RefreshCw className="w-8 h-8 animate-spin text-[#a15c38]" />
                    <span className="text-xs font-mono">Fetching campaign records...</span>
                  </div>
                ) : coupons.length === 0 ? (
                  <div className="text-center py-12 text-neutral-400">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                    <p className="text-xs">No active campaign coupons have been generated yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100 max-h-[500px] overflow-y-auto pr-2 space-y-1">
                    {coupons.map((item) => {
                      // Check if expired
                      const isExpired = new Date(item.expiry_date) < new Date();
                      
                      return (
                        <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <code className="bg-[#a15c38]/10 text-[#a15c38] px-2 py-0.5 rounded font-mono text-xs font-bold uppercase tracking-wider">
                                {item.code}
                              </code>
                              
                              {isExpired ? (
                                <span className="text-[8px] bg-neutral-100 text-neutral-500 border border-neutral-200 px-1.5 py-0.5 rounded uppercase font-semibold">
                                  Expired
                                </span>
                              ) : (
                                <span className="text-[8px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded uppercase font-semibold">
                                  Active
                                </span>
                              )}
                            </div>
                            
                            <p className="text-xs text-neutral-600 leading-normal flex items-center gap-1.5">
                              {item.type === "percentage" ? (
                                <Percent className="w-3.5 h-3.5 text-[#a15c38]" />
                              ) : (
                                <Tag className="w-3.5 h-3.5 text-neutral-500" />
                              )}
                              <span>
                                Gives a flat <strong className="text-neutral-900 font-semibold">{formatDiscount(item.type, item.value)}</strong> off.
                              </span>
                            </p>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <span className="text-[10px] text-neutral-400 block font-mono">Expiry Date</span>
                              <span className="text-xs font-semibold text-neutral-700 block font-mono flex items-center gap-1 justify-end">
                                <Calendar className="w-3 h-3" /> {new Date(item.expiry_date).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric"
                                })}
                              </span>
                            </div>

                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 hover:bg-rose-50 text-neutral-400 hover:text-rose-600 rounded transition cursor-pointer"
                              title="Delete Coupon Campaign"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
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
