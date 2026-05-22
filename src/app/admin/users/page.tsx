"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  Users, 
  Trash2, 
  Shield, 
  User, 
  ArrowLeft, 
  RefreshCw, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  CheckCircle,
  TrendingUp,
  ShoppingBag
} from "lucide-react";
import Link from "next/link";

interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
  orders_count: number;
  lifetime_value: string | number | null;
}

interface PaginatedUsers {
  current_page: number;
  data: UserRecord[];
  last_page: number;
  total: number;
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [pagination, setPagination] = useState<PaginatedUsers | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchUsers = async (page = 1, searchQuery = "") => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      if (searchQuery) {
        queryParams.append("search", searchQuery);
      }
      
      const res = await fetch(`${API_URL}/api/admin/users?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.users) {
          setUsers(data.users.data || []);
          setPagination({
            current_page: data.users.current_page || 1,
            data: data.users.data || [],
            last_page: data.users.last_page || 1,
            total: data.users.total || 0
          });
        } else {
          setError("Failed to parse system user directories.");
        }
      } else {
        setError("Unable to retrieve user directory. Verify credentials authorization.");
      }
    } catch (err) {
      console.error(err);
      setError("Network exception. Ensure the PHP Laravel server is active on Port 8000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, search);
  }, [currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers(1, search);
  };

  const handleToggleRole = async (userId: number, currentRole: "user" | "admin") => {
    const nextRole = currentRole === "admin" ? "user" : "admin";
    if (!confirm(`Are you sure you want to change this customer's credentials to ${nextRole.toUpperCase()}?`)) {
      return;
    }

    setActioning(userId);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: nextRole }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(data.message || `User role updated to ${nextRole.toUpperCase()} successfully.`);
        fetchUsers(currentPage, search);
      } else {
        setError(data.message || "Failed to toggle administrator role credentials.");
      }
    } catch (err) {
      setError("CORS or network blockage changing security credentials.");
    } finally {
      setActioning(null);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("CRITICAL WARNING: This will permanently purge this user record. This action CANNOT be undone! Proceed?")) {
      return;
    }

    setActioning(userId);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(data.message || "User records successfully pruned from directory database.");
        fetchUsers(currentPage, search);
      } else {
        setError(data.message || "Failed to delete user profile.");
      }
    } catch (err) {
      setError("CORS or network error dropping user log credentials.");
    } finally {
      setActioning(null);
    }
  };

  // Helper to safely parse numbers
  const formatCurrency = (val: string | number | null) => {
    if (!val) return "₹0.00";
    const parsed = typeof val === "string" ? parseFloat(val) : val;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(parsed);
  };

  // Total LTV computed from page
  const pageTotalLTV = users.reduce((sum, u) => {
    const ltv = u.lifetime_value ? (typeof u.lifetime_value === "string" ? parseFloat(u.lifetime_value) : u.lifetime_value) : 0;
    return sum + ltv;
  }, 0);

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
              Administrative User Directory
            </p>
          </div>
        </div>
        <button 
          onClick={() => fetchUsers(currentPage, search)}
          className="p-2 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded transition cursor-pointer"
          title="Refresh Directory"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
        
        {/* Messages Feedback */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {/* Small Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-neutral-200 p-6 rounded shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Total Registered</span>
              <Users className="w-4 h-4 text-[#a15c38]" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-neutral-900 font-mono">
                {pagination?.total || users.length} Customers
              </h3>
              <p className="text-[10px] text-neutral-400 mt-1">E-Commerce platform registered catalog accounts</p>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-6 rounded shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Audited Volume</span>
              <ShoppingBag className="w-4 h-4 text-[#a15c38]" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-neutral-900 font-mono">
                {users.reduce((sum, u) => sum + (u.orders_count || 0), 0)} Orders
              </h3>
              <p className="text-[10px] text-neutral-400 mt-1">Orders logged across visible directory rows</p>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-6 rounded shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Lifetime Value Sum</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-neutral-900 font-mono">
                {formatCurrency(pageTotalLTV)}
              </h3>
              <p className="text-[10px] text-neutral-400 mt-1">Sum value of paid transactions on this page</p>
            </div>
          </div>
        </div>

        {/* Directory Datatable Panel */}
        <div className="bg-white border border-neutral-200 rounded shadow-sm overflow-hidden">
          
          {/* Filtering Bar */}
          <div className="p-5 border-b border-neutral-200 bg-neutral-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-serif tracking-wider uppercase text-neutral-900">User Audit Datatable</h2>
              <p className="text-neutral-500 text-[10px] tracking-wide mt-0.5">
                Inspect accounts, toggle security authority, or remove profiles
              </p>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-sm w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by Name or Email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border border-neutral-200 focus:border-brand-charcoal text-xs py-2 pl-9 pr-3 focus:outline-none focus:bg-white transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#a15c38] hover:bg-[#894b2c] text-white text-xs tracking-widest uppercase font-semibold transition cursor-pointer"
              >
                Find
              </button>
            </form>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-neutral-400 gap-3">
                <RefreshCw className="w-8 h-8 animate-spin text-[#a15c38]" />
                <span className="text-xs font-mono">Retrieving account files...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-20 text-neutral-400 space-y-2">
                <Users className="w-12 h-12 mx-auto text-neutral-300" />
                <p className="text-xs">No registered customer profiles match your search criteria.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    <th className="py-4 px-6">User Profile</th>
                    <th className="py-4 px-6">System ID</th>
                    <th className="py-4 px-6">Credentials Role</th>
                    <th className="py-4 px-6 text-center">Orders logged</th>
                    <th className="py-4 px-6 text-right">Lifetime Value (LTV)</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs">
                  {users.map((item) => (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-[#fbfbf9]/60 transition duration-150 ${actioning === item.id ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 flex items-center justify-center font-bold">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-neutral-900 block">{item.name}</span>
                            <span className="text-[10px] text-neutral-500 font-mono block">{item.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-[10px] text-neutral-500">
                        UID-{item.id}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold border ${
                          item.role === "admin" 
                            ? "bg-rose-50 border-rose-200 text-rose-800"
                            : "bg-[#a15c38]/10 border-[#a15c38]/20 text-[#a15c38]"
                        }`}>
                          <Shield className="w-2.5 h-2.5" />
                          {item.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center font-mono font-medium text-neutral-800">
                        {item.orders_count || 0}
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-neutral-900">
                        {formatCurrency(item.lifetime_value)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleToggleRole(item.id, item.role)}
                            className="text-[10px] tracking-wider uppercase font-semibold text-neutral-500 hover:text-neutral-900 transition flex items-center gap-1 cursor-pointer bg-neutral-100 border border-neutral-200 px-2.5 py-1 rounded"
                            title="Toggle Credentials Role"
                          >
                            Toggle Role
                          </button>
                          
                          <button
                            onClick={() => handleDeleteUser(item.id)}
                            className="p-1.5 hover:bg-rose-50 text-neutral-400 hover:text-rose-600 rounded transition cursor-pointer"
                            title="Prune Record Cascade"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Deck */}
          {pagination && pagination.last_page > 1 && (
            <div className="p-5 border-t border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                Page {pagination.current_page} of {pagination.last_page} ({pagination.total} entries)
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 border border-neutral-200 rounded transition flex items-center justify-center cursor-pointer bg-white text-neutral-600 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(pagination.last_page, prev + 1))}
                  disabled={currentPage === pagination.last_page}
                  className={`p-2 border border-neutral-200 rounded transition flex items-center justify-center cursor-pointer bg-white text-neutral-600 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
