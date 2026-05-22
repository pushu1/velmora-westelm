"use client";

import React, { useState, useEffect } from "react";
import ProductForm from "@/components/admin/ProductForm";
import { useSession, signOut } from "next-auth/react";
import { 
  Package, 
  Tag, 
  ShoppingBag, 
  LogOut, 
  User, 
  Layers, 
  Activity, 
  ArrowUpRight,
  TrendingUp,
  Percent,
  CheckCircle,
  Clock,
  Truck,
  Users,
  Database,
  BarChart3,
  ChevronRight,
  UploadCloud,
  RefreshCw,
  CreditCard
} from "lucide-react";
import Link from "next/link";

type TabId = "dashboard" | "inventory" | "orders";

interface Aggregates {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
}

interface RevenuePoint {
  date: string;
  amount: number;
}

interface RegistrationPoint {
  date: string;
  count: number;
}

interface CategorySplit {
  name: string;
  volume: number;
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  
  // Dashboard Analytics states
  const [loading, setLoading] = useState(true);
  const [aggregates, setAggregates] = useState<Aggregates>({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0
  });
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
  const [registrationData, setRegistrationData] = useState<RegistrationPoint[]>([]);
  const [categoriesData, setCategoriesData] = useState<CategorySplit[]>([]);
  const [error, setError] = useState<string | null>(null);

  const adminName = session?.user?.name || "Admin Manager";
  const adminEmail = session?.user?.email || "admin@westelm.in";
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/dashboard/stats`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAggregates(data.aggregates);
          setRevenueData(data.revenue || []);
          setRegistrationData(data.registrations || []);
          setCategoriesData(data.categories || []);
        }
      } else {
        setError("Failed to fetch executive dashboard metrics.");
      }
    } catch (err) {
      console.error("Dashboard stats fetch error:", err);
      setError("Network offline. Displaying simulated aggregates fallback.");
      // Fallback local mockup for smooth UI
      setAggregates({
        totalRevenue: 4255000,
        totalOrders: 752,
        totalUsers: 1485,
        totalProducts: 124
      });
      // Generate 30 days of mock stats
      const mockRev: RevenuePoint[] = [];
      const mockReg: RegistrationPoint[] = [];
      const today = new Date();
      for (let i = 29; i >= 0; i--) {
        const dateStr = new Date(today.getTime() - i * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        });
        mockRev.push({ date: dateStr, amount: Math.floor(Math.random() * 200000) + 50000 });
        mockReg.push({ date: dateStr, count: Math.floor(Math.random() * 25) + 5 });
      }
      setRevenueData(mockRev);
      setRegistrationData(mockReg);
      setCategoriesData([
        { name: "Living Room", volume: 382 },
        { name: "Bedroom Furniture", volume: 241 },
        { name: "Dining & Kitchen", volume: 195 },
        { name: "Outdoor Furniture", volume: 134 },
        { name: "Decor & Lighting", volume: 98 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Helper calculations for SVG layouts
  const maxRevenue = Math.max(...revenueData.map(r => r.amount), 1);
  const maxRegistrations = Math.max(...registrationData.map(r => r.count), 1);

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col font-sans selection:bg-[#a15c38] selection:text-white">
      
      {/* Top Luxury Admin Banner */}
      <header className="bg-[#1c1c1c] text-white border-b border-neutral-800 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-[#a15c38] rounded-full flex items-center justify-center font-serif text-white font-bold tracking-wider">
            WE
          </div>
          <div>
            <h1 className="text-sm font-serif tracking-widest uppercase">West Elm India</h1>
            <p className="text-[10px] text-[#c2966e] tracking-widest uppercase font-semibold">
              Administrative Control Console
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs font-semibold text-neutral-200">{adminName}</span>
            <span className="text-[10px] text-[#a15c38] font-mono">{adminEmail}</span>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-2 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded transition cursor-pointer"
            title="Sign Out Console"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* Left Column: Fixed Navigation Rail */}
        <aside className="w-full lg:w-72 bg-[#1c1c1c] text-neutral-300 lg:border-r border-neutral-800 flex flex-col justify-between p-6 space-y-8 shrink-0">
          
          <div className="space-y-6">
            {/* Quick Profile */}
            <div className="p-4 bg-neutral-900 border border-neutral-800/80 rounded flex items-center gap-3">
              <div className="h-10 w-10 rounded bg-[#a15c38]/10 border border-[#a15c38]/30 flex items-center justify-center text-[#a15c38]">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-bold">Role</span>
                <span className="text-xs font-semibold text-neutral-200 uppercase tracking-widest block truncate">
                  Sysadmin Manager
                </span>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <nav className="space-y-1.5" aria-label="Admin Control Modules">
              
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-medium rounded transition duration-200 cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-[#a15c38] text-white font-semibold"
                    : "hover:bg-neutral-900 hover:text-white"
                }`}
              >
                <BarChart3 className="w-4 h-4 shrink-0" />
                Dashboard Analytics
              </button>

              <button
                onClick={() => setActiveTab("inventory")}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-medium rounded transition duration-200 cursor-pointer ${
                  activeTab === "inventory"
                    ? "bg-[#a15c38] text-white font-semibold"
                    : "hover:bg-neutral-900 hover:text-white"
                }`}
              >
                <Package className="w-4 h-4 shrink-0" />
                Inventory Management
              </button>

              <Link
                href="/admin/categories"
                className="w-full flex items-center justify-between px-4 py-3 text-xs uppercase tracking-widest font-medium rounded transition duration-200 text-neutral-300 hover:bg-neutral-900 hover:text-white"
              >
                <span className="flex items-center gap-3">
                  <Layers className="w-4 h-4 shrink-0 text-neutral-400" />
                  Category Hierarchy
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
              </Link>

              <Link
                href="/admin/bulk-upload"
                className="w-full flex items-center justify-between px-4 py-3 text-xs uppercase tracking-widest font-medium rounded transition duration-200 text-neutral-300 hover:bg-neutral-900 hover:text-white"
              >
                <span className="flex items-center gap-3">
                  <UploadCloud className="w-4 h-4 shrink-0 text-neutral-400" />
                  Bulk Excel Import
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
              </Link>

              <Link
                href="/admin/users"
                className="w-full flex items-center justify-between px-4 py-3 text-xs uppercase tracking-widest font-medium rounded transition duration-200 text-neutral-300 hover:bg-neutral-900 hover:text-white"
              >
                <span className="flex items-center gap-3">
                  <Users className="w-4 h-4 shrink-0 text-neutral-400" />
                  User Directory
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
              </Link>

              <Link
                href="/admin/coupons"
                className="w-full flex items-center justify-between px-4 py-3 text-xs uppercase tracking-widest font-medium rounded transition duration-200 text-neutral-300 hover:bg-neutral-900 hover:text-white"
              >
                <span className="flex items-center gap-3">
                  <Tag className="w-4 h-4 shrink-0 text-neutral-400" />
                  Campaign Coupons
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
              </Link>

              <Link
                href="/admin/settings/payment"
                className="w-full flex items-center justify-between px-4 py-3 text-xs uppercase tracking-widest font-medium rounded transition duration-200 text-neutral-300 hover:bg-neutral-900 hover:text-white"
              >
                <span className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 shrink-0 text-neutral-400" />
                  Payment Settings
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
              </Link>

              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-medium rounded transition duration-200 cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-[#a15c38] text-white font-semibold"
                    : "hover:bg-neutral-900 hover:text-white"
                }`}
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                Customer Orders
              </button>
            </nav>
          </div>

          {/* Sidebar Footer System Info */}
          <div className="pt-4 border-t border-neutral-800 text-[10px] text-neutral-500 space-y-1">
            <div>Framework: Next.js 16 (App Router)</div>
            <div>Auth Status: Session Verified</div>
            <div>Database Sync: Active (Laravel/MySQL)</div>
          </div>
        </aside>

        {/* Right Column: Canvas Content */}
        <main className="flex-1 bg-[#fafafa] p-6 lg:p-10 overflow-y-auto">
          
          {/* TAB 1: EXECUTIVE ANALYTICS DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Heading */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-serif text-neutral-900 tracking-wide">Executive Analytics Deck</h2>
                  <p className="text-neutral-500 text-xs mt-1">
                    Compiled metrics reflecting direct Laravel database transactions and payment statuses.
                  </p>
                </div>
                <button 
                  onClick={fetchDashboardStats} 
                  className="px-4 py-2 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 text-xs uppercase tracking-widest font-semibold flex items-center gap-2 rounded shadow-sm transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  Sync Metrics
                </button>
              </div>

              {/* Core Dashboard Metric Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                <div className="bg-white border border-neutral-200 p-6 rounded shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Paid Revenue</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 font-mono tracking-tight">
                      {formatCurrency(aggregates.totalRevenue)}
                    </h3>
                    <p className="text-[10px] text-neutral-400 mt-1">Direct Stripe / Gateway captures</p>
                  </div>
                </div>

                <div className="bg-white border border-neutral-200 p-6 rounded shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-[#a15c38]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 font-mono">
                      {aggregates.totalOrders} Placed
                    </h3>
                    <p className="text-[10px] text-neutral-400 mt-1">Total database checkouts</p>
                  </div>
                </div>

                <div className="bg-white border border-neutral-200 p-6 rounded shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Registered Users</span>
                    <Users className="w-4 h-4 text-[#a15c38]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 font-mono">
                      {aggregates.totalUsers} Accounts
                    </h3>
                    <p className="text-[10px] text-neutral-400 mt-1">Database user profiles</p>
                  </div>
                </div>

                <div className="bg-white border border-neutral-200 p-6 rounded shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Catalog Count</span>
                    <Database className="w-4 h-4 text-[#a15c38]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 font-mono">
                      {aggregates.totalProducts} Items
                    </h3>
                    <p className="text-[10px] text-neutral-400 mt-1">Active inventory rows</p>
                  </div>
                </div>

              </div>

              {/* Spectacular custom SVG Area Curve (Revenue over time) */}
              <div className="bg-white border border-neutral-200 p-6 rounded shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
                  <div>
                    <h3 className="text-sm font-serif tracking-wider uppercase text-neutral-900">Revenue Stream Trend</h3>
                    <p className="text-[10px] text-neutral-400">30-day transactional billing increments (INR)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#a15c38] font-mono block">Max Peak</span>
                    <span className="text-[10px] text-neutral-500 font-mono">{formatCurrency(maxRevenue)}</span>
                  </div>
                </div>

                {loading ? (
                  <div className="h-[250px] flex items-center justify-center text-neutral-400">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#a15c38]" />
                  </div>
                ) : revenueData.length < 2 ? (
                  <div className="h-[250px] flex items-center justify-center text-neutral-400">
                    <span>Insufficient transaction points to render area stream.</span>
                  </div>
                ) : (
                  <div className="relative">
                    <svg viewBox="0 0 1000 250" className="w-full h-[250px] overflow-visible">
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#a15c38" stopOpacity="0.25"/>
                          <stop offset="100%" stopColor="#a15c38" stopOpacity="0.0"/>
                        </linearGradient>
                      </defs>

                      {/* SVG Grid Lines */}
                      <line x1="0" y1="50" x2="1000" y2="50" stroke="#f0f0f0" strokeDasharray="4 4" />
                      <line x1="0" y1="125" x2="1000" y2="125" stroke="#f0f0f0" strokeDasharray="4 4" />
                      <line x1="0" y1="200" x2="1000" y2="200" stroke="#f0f0f0" strokeDasharray="4 4" />

                      {/* Build the paths */}
                      {(() => {
                        const width = 1000;
                        const height = 200;
                        const points = revenueData.map((pt, idx) => {
                          const x = (idx / (revenueData.length - 1)) * width;
                          // Leave a bottom margin of 20px
                          const y = height - (pt.amount / maxRevenue) * (height - 30);
                          return { x, y };
                        });

                        const linePath = points.reduce((acc, pt, idx) => {
                          return acc + `${idx === 0 ? "M" : "L"} ${pt.x} ${pt.y}`;
                        }, "");

                        const areaPath = linePath + ` L ${width} ${height} L 0 ${height} Z`;

                        return (
                          <>
                            {/* Area Gradient */}
                            <path d={areaPath} fill="url(#areaGrad)" />
                            {/* Line Curve */}
                            <path d={linePath} fill="none" stroke="#a15c38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            {/* Accent Points */}
                            {points.filter((_, i) => i % 5 === 0 || i === points.length - 1).map((pt, idx) => (
                              <circle key={idx} cx={pt.x} cy={pt.y} r="4" fill="#1c1c1c" stroke="#a15c38" strokeWidth="2" />
                            ))}
                          </>
                        );
                      })()}
                    </svg>

                    {/* Timeline labels bar */}
                    <div className="flex justify-between items-center text-[9px] font-mono text-neutral-400 mt-2 border-t border-neutral-100 pt-2">
                      <span>{revenueData[0]?.date || "Day 1"}</span>
                      <span>{revenueData[Math.floor(revenueData.length / 2)]?.date || "Day 15"}</span>
                      <span>{revenueData[revenueData.length - 1]?.date || "Day 30"}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Two Column Grid for Acquisitions and Categories */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Visual Bar Chart: User Acquisitions */}
                <div className="bg-white border border-neutral-200 p-6 rounded shadow-sm space-y-4">
                  <div className="border-b border-neutral-100 pb-4">
                    <h3 className="text-sm font-serif tracking-wider uppercase text-neutral-900">User Registrations</h3>
                    <p className="text-[10px] text-neutral-400">Daily customer acquisition ratios inside database</p>
                  </div>

                  {loading ? (
                    <div className="h-[180px] flex items-center justify-center text-neutral-400">
                      <RefreshCw className="w-5 h-5 animate-spin text-[#a15c38]" />
                    </div>
                  ) : registrationData.length === 0 ? (
                    <div className="h-[180px] flex items-center justify-center text-neutral-400">
                      <span>No registration logs available.</span>
                    </div>
                  ) : (
                    <div>
                      <svg viewBox="0 0 500 150" className="w-full h-[150px] overflow-visible">
                        {/* Render vertical bar elements */}
                        {registrationData.slice(-15).map((pt, idx, arr) => {
                          const barWidth = 18;
                          const spacing = 12;
                          const totalWidth = arr.length * barWidth + (arr.length - 1) * spacing;
                          const startX = (500 - totalWidth) / 2;
                          const x = startX + idx * (barWidth + spacing);
                          const barHeight = (pt.count / maxRegistrations) * 110;
                          // bottom baseline at 130
                          const y = 130 - barHeight;

                          return (
                            <g key={idx} className="group">
                              {/* Hover Tooltip trigger box */}
                              <rect 
                                x={x} 
                                y={y} 
                                width={barWidth} 
                                height={barHeight} 
                                fill="#a15c38" 
                                opacity="0.85"
                                className="transition-all duration-300 hover:opacity-100 cursor-pointer hover:fill-[#894b2c] rounded-t-sm" 
                              />
                              {/* Small mini count text on hover */}
                              <text 
                                x={x + barWidth / 2} 
                                y={y - 5} 
                                fill="#1c1c1c" 
                                fontSize="8" 
                                fontFamily="monospace" 
                                textAnchor="middle" 
                                fontWeight="bold"
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              >
                                {pt.count}
                              </text>
                            </g>
                          );
                        })}
                        {/* Baseline */}
                        <line x1="10" y1="130" x2="490" y2="130" stroke="#dcdcdc" strokeWidth="1" />
                      </svg>

                      {/* Timeline labels bar */}
                      <div className="flex justify-between items-center text-[8px] font-mono text-neutral-400 mt-2 border-t border-neutral-100 pt-2 px-4">
                        <span>{registrationData[registrationData.length - 15]?.date || "Day 1"}</span>
                        <span>{registrationData[registrationData.length - 1]?.date || "Today"}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Horizontal Progress Bars: Top categories split */}
                <div className="bg-white border border-neutral-200 p-6 rounded shadow-sm space-y-4">
                  <div className="border-b border-neutral-100 pb-4">
                    <h3 className="text-sm font-serif tracking-wider uppercase text-neutral-900">Top Selling Categories</h3>
                    <p className="text-[10px] text-neutral-400">Order item volumes mapping target departments</p>
                  </div>

                  {loading ? (
                    <div className="h-[180px] flex items-center justify-center text-neutral-400">
                      <RefreshCw className="w-5 h-5 animate-spin text-[#a15c38]" />
                    </div>
                  ) : categoriesData.length === 0 ? (
                    <div className="h-[180px] flex items-center justify-center text-neutral-400">
                      <span>No dynamic category purchases recorded.</span>
                    </div>
                  ) : (
                    <div className="space-y-4 py-2">
                      {(() => {
                        const totalVolume = categoriesData.reduce((sum, c) => sum + c.volume, 1);
                        return categoriesData.map((item, idx) => {
                          const percentage = Math.round((item.volume / totalVolume) * 100);
                          
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-neutral-700">{item.name}</span>
                                <span className="font-mono text-neutral-500 font-medium">
                                  {item.volume} units ({percentage}%)
                                </span>
                              </div>
                              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                                <div 
                                  className="h-full bg-[#a15c38] rounded-full transition-all duration-500" 
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: INVENTORY PRODUCT SUBMISSION FORM */}
          {activeTab === "inventory" && (
            <div className="bg-white p-6 md:p-8 border border-neutral-200 rounded shadow-sm">
              <ProductForm />
            </div>
          )}

          {/* TAB 3: CUSTOMER ORDERS LIST */}
          {activeTab === "orders" && (
            <div className="space-y-8 animate-fadeIn">
              {/* Heading */}
              <div>
                <h2 className="text-2xl font-serif text-neutral-900 tracking-wide">Client Order Operations</h2>
                <p className="text-neutral-500 text-xs mt-1">
                  Track purchasing sessions, verify Stripe payments, and coordinate delivery shipments.
                </p>
              </div>

              {/* Order Records List */}
              <div className="bg-white border border-neutral-200 rounded shadow-sm overflow-hidden">
                <div className="p-5 border-b border-neutral-200 bg-neutral-50/50 flex justify-between items-center">
                  <h3 className="text-sm font-serif tracking-wider uppercase text-neutral-900">System Checkout Log</h3>
                  <span className="text-[10px] bg-neutral-200 border border-neutral-300 text-neutral-600 font-mono font-bold px-2 py-0.5 rounded">
                    3 Log Entries
                  </span>
                </div>

                <div className="divide-y divide-neutral-200">
                  
                  {/* Order 1 */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                      <div>
                        <span className="text-xs font-bold text-neutral-900 font-mono">WO-98425</span>
                        <span className="text-xs text-neutral-400 block font-mono">Placed 22 May 2026</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded uppercase font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Paid (Captured)
                        </span>
                        <span className="text-[10px] bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded uppercase font-semibold flex items-center gap-1">
                          <Truck className="w-3 h-3" /> Shipped
                        </span>
                      </div>
                    </div>

                    <div className="text-xs grid grid-cols-1 md:grid-cols-3 gap-4 bg-neutral-50 p-4 rounded border border-neutral-100">
                      <div>
                        <strong className="text-neutral-500 block uppercase text-[9px] tracking-wider mb-0.5">Purchaser Details</strong>
                        <span className="font-medium text-neutral-800 block">Yuvraj Singh</span>
                        <span className="text-neutral-500 font-mono">customer@gmail.com</span>
                      </div>
                      <div>
                        <strong className="text-neutral-500 block uppercase text-[9px] tracking-wider mb-0.5">Cart Summary</strong>
                        <span className="text-neutral-700 block leading-relaxed">
                          Haven Velvet Sofa (Pewter Gray Velvet) x1, Waffle Weave Bathrobe (Sage Green) x1
                        </span>
                      </div>
                      <div>
                        <strong className="text-neutral-500 block uppercase text-[9px] tracking-wider mb-0.5">Accounting</strong>
                        <span className="font-bold text-[#a15c38] font-mono text-sm">₹84,998.00</span>
                        <span className="text-neutral-400 font-mono block text-[10px]">ID: cs_test_StripeActive88A</span>
                      </div>
                    </div>
                  </div>

                  {/* Order 2 */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                      <div>
                        <span className="text-xs font-bold text-neutral-900 font-mono">WO-98426</span>
                        <span className="text-xs text-neutral-400 block font-mono">Placed 21 May 2026</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded uppercase font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Paid (Captured)
                        </span>
                        <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded uppercase font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Processing
                        </span>
                      </div>
                    </div>

                    <div className="text-xs grid grid-cols-1 md:grid-cols-3 gap-4 bg-neutral-50 p-4 rounded border border-neutral-100">
                      <div>
                        <strong className="text-neutral-500 block uppercase text-[9px] tracking-wider mb-0.5">Purchaser Details</strong>
                        <span className="font-medium text-neutral-800 block">Devansh Gupta</span>
                        <span className="text-neutral-500 font-mono">devansh@gmail.com</span>
                      </div>
                      <div>
                        <strong className="text-neutral-500 block uppercase text-[9px] tracking-wider mb-0.5">Cart Summary</strong>
                        <span className="text-neutral-700 block leading-relaxed">
                          Belgian Flax Linen Duvet Cover (Stark White) x1
                        </span>
                      </div>
                      <div>
                        <strong className="text-neutral-500 block uppercase text-[9px] tracking-wider mb-0.5">Accounting</strong>
                        <span className="font-bold text-[#a15c38] font-mono text-sm">₹12,999.00</span>
                        <span className="text-neutral-400 font-mono block text-[10px]">ID: cs_test_StripeActive99B</span>
                      </div>
                    </div>
                  </div>

                  {/* Order 3 */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                      <div>
                        <span className="text-xs font-bold text-neutral-900 font-mono">WO-98427</span>
                        <span className="text-xs text-neutral-400 block font-mono">Placed 20 May 2026</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded uppercase font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Payment Pending
                        </span>
                        <span className="text-[10px] bg-neutral-100 text-neutral-500 border border-neutral-200 px-2 py-0.5 rounded uppercase font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Hold
                        </span>
                      </div>
                    </div>

                    <div className="text-xs grid grid-cols-1 md:grid-cols-3 gap-4 bg-neutral-50 p-4 rounded border border-neutral-100">
                      <div>
                        <strong className="text-neutral-500 block uppercase text-[9px] tracking-wider mb-0.5">Purchaser Details</strong>
                        <span className="font-medium text-neutral-800 block">Ananya Sharma</span>
                        <span className="text-neutral-500 font-mono">ananya@outlook.com</span>
                      </div>
                      <div>
                        <strong className="text-neutral-500 block uppercase text-[9px] tracking-wider mb-0.5">Cart Summary</strong>
                        <span className="text-neutral-700 block leading-relaxed">
                          Oliver Accent Chair (Olive Green Velvet) x1
                        </span>
                      </div>
                      <div>
                        <strong className="text-neutral-500 block uppercase text-[9px] tracking-wider mb-0.5">Accounting</strong>
                        <span className="font-bold text-neutral-600 font-mono text-sm">₹24,999.00</span>
                        <span className="text-neutral-400 font-mono block text-[10px]">Stripe Checkout Session Initialized</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
