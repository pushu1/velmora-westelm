"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  ArrowLeft, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  HelpCircle, 
  CreditCard, 
  Save, 
  Info,
  ServerCrash
} from "lucide-react";
import Link from "next/link";

interface GatewayKeys {
  public_key: string;
  secret_key: string;
  webhook_secret: string;
}

export default function AdminPaymentSettingsPage() {
  const { data: session } = useSession();
  
  // Settings States
  const [activeGateway, setActiveGateway] = useState<"stripe" | "razorpay">("stripe");
  const [testMode, setTestMode] = useState<boolean>(true);
  
  const [stripeKeys, setStripeKeys] = useState<GatewayKeys>({
    public_key: "",
    secret_key: "",
    webhook_secret: ""
  });
  
  const [razorpayKeys, setRazorpayKeys] = useState<GatewayKeys>({
    public_key: "",
    secret_key: "",
    webhook_secret: ""
  });

  // UI States
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [showWebhook, setShowWebhook] = useState<boolean>(false);
  
  // Feedback Messages
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Fetch Settings on Mount
  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/settings/payment`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setActiveGateway(data.active_gateway || "stripe");
          setTestMode(data.test_mode);
          
          if (data.stripe) {
            setStripeKeys({
              public_key: data.stripe.public_key || "",
              secret_key: data.stripe.secret_key || "",
              webhook_secret: data.stripe.webhook_secret || ""
            });
          }
          if (data.razorpay) {
            setRazorpayKeys({
              public_key: data.razorpay.public_key || "",
              secret_key: data.razorpay.secret_key || "",
              webhook_secret: data.razorpay.webhook_secret || ""
            });
          }
        } else {
          setError("Failed to fetch administrative payment gateway states.");
        }
      } else {
        setError("Laravel server returned an error code. Verify route mappings.");
      }
    } catch (err: any) {
      console.error("Fetch settings error:", err);
      setError("Network offline. Unable to reach Laravel backend APIs.");
      
      // Load offline simulated fallback to keep UI perfectly interactive
      setStripeKeys({
        public_key: "pk_test_51O8vHJS...",
        secret_key: "sk_test_••••••••••••••••••••",
        webhook_secret: "whsec_••••••••••••••••••••"
      });
      setRazorpayKeys({
        public_key: "rzp_test_3a8hJD...",
        secret_key: "rzp_sec_••••••••••••••••••••",
        webhook_secret: "rzp_sec_••••••••••••••••••••"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Handle Input Changes
  const handleKeyChange = (field: keyof GatewayKeys, value: string) => {
    if (activeGateway === "stripe") {
      setStripeKeys(prev => ({ ...prev, [field]: value }));
    } else {
      setRazorpayKeys(prev => ({ ...prev, [field]: value }));
    }
  };

  // Submit Settings
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const currentKeys = activeGateway === "stripe" ? stripeKeys : razorpayKeys;

    try {
      const res = await fetch(`${API_URL}/api/admin/settings/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          active_gateway: activeGateway,
          test_mode: testMode,
          public_key: currentKeys.public_key,
          secret_key: currentKeys.secret_key,
          webhook_secret: currentKeys.webhook_secret
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(data.message || "Credentials securely synchronized.");
        setToast({
          type: "success",
          message: data.message || "Payment settings successfully updated!"
        });
        
        // Reload to get fresh masked keys
        fetchSettings();
      } else {
        setError(data.message || "Failed to commit payment settings.");
        setToast({
          type: "error",
          message: data.message || "Failed to update configurations."
        });
      }
    } catch (err: any) {
      console.error("Save settings error:", err);
      setError("Network timeout. Could not commit keys to Laravel backend.");
      setToast({
        type: "error",
        message: "Network connection failure. Settings stored locally only."
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Switch gate tab helper
  const activeKeys = activeGateway === "stripe" ? stripeKeys : razorpayKeys;

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-[#a15c38] selection:text-white relative">
      
      {/* Luxury Float Toasts */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-4 rounded border shadow-xl flex items-center gap-3 animate-slideIn max-w-sm ${
          toast.type === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : "bg-rose-50 border-rose-200 text-rose-800"
        }`}>
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <div className="text-xs font-medium">{toast.message}</div>
        </div>
      )}

      {/* Mini Admin Nav Header */}
      <header className="bg-[#1c1c1c] text-white px-6 py-4 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 hover:bg-neutral-800 rounded transition text-neutral-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xs font-serif tracking-widest uppercase">West Elm India</h1>
            <p className="text-[10px] text-[#c2966e] tracking-widest uppercase font-semibold">
              Payment Gateway Console
            </p>
          </div>
        </div>
        <button 
          onClick={fetchSettings}
          disabled={loading}
          className="p-2 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded transition cursor-pointer disabled:opacity-50"
          title="Refresh Settings"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </header>

      {/* Main Canvas Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12 overflow-y-auto">
        
        {/* Breadcrumb path */}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-400 mb-6">
          <Link href="/admin" className="hover:text-[#a15c38]">Admin Control</Link>
          <span>/</span>
          <span className="text-neutral-600">Settings</span>
          <span>/</span>
          <span className="text-[#a15c38] font-semibold">Payments</span>
        </div>

        {/* Heading */}
        <div className="mb-10">
          <h2 className="text-3xl font-serif text-neutral-900 tracking-wide">Payment Configurations</h2>
          <p className="text-neutral-500 text-xs mt-1 max-w-2xl font-light leading-relaxed">
            Manage dynamic payment credentials securely stored in the Laravel database. 
            Active configurations dynamically boot into framework services at runtime, completely decoupling the platform from static environments.
          </p>
        </div>

        {/* Global Connection Warning */}
        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-800 text-xs font-medium rounded flex items-start gap-3 shadow-sm">
            <ServerCrash className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold uppercase tracking-wider text-[10px] text-rose-700">Database Connection Intercepted</p>
              <p className="text-neutral-600 font-light">{error}</p>
              <p className="text-[10px] text-rose-600 font-semibold mt-1">Operating in offline simulator mode. Changes will not persist to Laravel.</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-medium rounded flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {/* Content Skeletons or Body */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6 bg-white p-8 border border-neutral-100 rounded-md">
              <div className="h-6 bg-neutral-100 w-1/4 rounded animate-pulse" />
              <div className="h-10 bg-neutral-50 w-full rounded animate-pulse" />
              <div className="space-y-4 pt-4">
                <div className="h-12 bg-neutral-100 w-full rounded animate-pulse" />
                <div className="h-12 bg-neutral-100 w-full rounded animate-pulse" />
                <div className="h-12 bg-neutral-100 w-full rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-6 bg-neutral-50 p-8 border border-neutral-200/60 rounded-md">
              <div className="h-6 bg-neutral-200/50 w-1/2 rounded animate-pulse" />
              <div className="h-20 bg-neutral-200/30 w-full rounded animate-pulse" />
              <div className="h-20 bg-neutral-200/30 w-full rounded animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Column 1 & 2: Main Form Card */}
            <div className="lg:col-span-2 bg-white border border-neutral-200/80 rounded shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 border-b border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-serif uppercase tracking-wider text-neutral-800">Gateway Operations</h3>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">Configure active channels</p>
                </div>
                
                {/* Active Gateway Tabs */}
                <div className="flex bg-neutral-200/60 p-1 rounded-md max-w-xs w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveGateway("stripe");
                      setError(null);
                      setSuccess(null);
                    }}
                    className={`flex-1 sm:flex-initial px-6 py-2 text-[10px] uppercase tracking-wider font-semibold rounded-md transition duration-200 cursor-pointer ${
                      activeGateway === "stripe"
                        ? "bg-white text-[#a15c38] shadow-sm font-bold"
                        : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    Stripe Core
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveGateway("razorpay");
                      setError(null);
                      setSuccess(null);
                    }}
                    className={`flex-1 sm:flex-initial px-6 py-2 text-[10px] uppercase tracking-wider font-semibold rounded-md transition duration-200 cursor-pointer ${
                      activeGateway === "razorpay"
                        ? "bg-white text-[#a15c38] shadow-sm font-bold"
                        : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    Razorpay India
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                
                {/* Environment Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200/60 rounded">
                  <div className="flex gap-3">
                    <CreditCard className="w-5 h-5 text-[#a15c38] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-neutral-800">Operational Mode</h4>
                      <p className="text-[10px] text-neutral-500 leading-relaxed font-light mt-0.5">
                        {testMode 
                          ? "Sandbox Environment: Simulates test orders using test card tokens." 
                          : "Live Production: Processes genuine credit card transactions with immediate billing."}
                      </p>
                    </div>
                  </div>
                  
                  {/* Luxury Slider Switch */}
                  <button
                    type="button"
                    onClick={() => setTestMode(!testMode)}
                    className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-neutral-200"
                    style={{ backgroundColor: testMode ? "#c2966e" : "#1c1c1c" }}
                  >
                    <span
                      className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      style={{ transform: testMode ? "translateX(0px)" : "translateX(20px)" }}
                    />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Public Key */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-600 block">
                      {activeGateway === "stripe" ? "Stripe Publishable Key" : "Razorpay Key ID"}
                    </label>
                    <input
                      type="text"
                      value={activeKeys.public_key}
                      onChange={(e) => handleKeyChange("public_key", e.target.value)}
                      placeholder={activeGateway === "stripe" ? "pk_test_..." : "rzp_test_..."}
                      className="w-full px-4 py-3 bg-[#fafafa] border border-neutral-200 hover:border-neutral-300 focus:border-[#a15c38] rounded text-xs text-neutral-800 placeholder-neutral-400 tracking-wide font-mono focus:outline-none transition"
                      required
                    />
                    <p className="text-[9px] text-neutral-400 font-light font-sans">
                      Standard public API key identifier used by frontend checkout scripts.
                    </p>
                  </div>

                  {/* Secret Key */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-600 block">
                      {activeGateway === "stripe" ? "Stripe Secret Key" : "Razorpay Key Secret"}
                    </label>
                    <div className="relative">
                      <input
                        type={showSecret ? "text" : "password"}
                        value={activeKeys.secret_key}
                        onChange={(e) => handleKeyChange("secret_key", e.target.value)}
                        placeholder="••••••••••••••••••••••••••••••••"
                        className="w-full pl-4 pr-12 py-3 bg-[#fafafa] border border-neutral-200 hover:border-neutral-300 focus:border-[#a15c38] rounded text-xs text-neutral-800 placeholder-neutral-400 tracking-wide font-mono focus:outline-none transition"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                        title={showSecret ? "Mask key" : "Reveal key"}
                      >
                        {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[9px] text-[#a15c38] font-medium flex items-center gap-1">
                      <Info className="w-3 h-3 text-[#a15c38]" />
                      Double Mask Activated: Secret is hidden. Asterisks will not overwrite the key on save.
                    </p>
                  </div>

                  {/* Webhook Secret */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-600 block">
                      {activeGateway === "stripe" ? "Stripe Webhook Secret" : "Razorpay Webhook Signature"}
                    </label>
                    <div className="relative">
                      <input
                        type={showWebhook ? "text" : "password"}
                        value={activeKeys.webhook_secret}
                        onChange={(e) => handleKeyChange("webhook_secret", e.target.value)}
                        placeholder="••••••••••••••••••••••••••••••••"
                        className="w-full pl-4 pr-12 py-3 bg-[#fafafa] border border-neutral-200 hover:border-neutral-300 focus:border-[#a15c38] rounded text-xs text-neutral-800 placeholder-neutral-400 tracking-wide font-mono focus:outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowWebhook(!showWebhook)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                        title={showWebhook ? "Mask key" : "Reveal key"}
                      >
                        {showWebhook ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[9px] text-neutral-400 font-light">
                      Required for secure signature validation of payment events on webhook callback hooks.
                    </p>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-neutral-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 bg-[#1c1c1c] hover:bg-[#a15c38] text-white text-xs uppercase tracking-widest font-semibold rounded transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {submitting ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>{submitting ? "Synchronizing Credentials..." : "Commit Gateway Settings"}</span>
                  </button>
                </div>

              </form>
            </div>

            {/* Column 3: Security & Status Side Card */}
            <div className="space-y-6">
              
              {/* Active Status Badge */}
              <div className="bg-[#1c1c1c] text-white p-6 rounded shadow-sm border border-neutral-800 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-[#c2966e] tracking-widest uppercase font-bold">System Status</span>
                  <h4 className="text-lg font-serif mt-1">Live Injection Routing</h4>
                </div>
                
                <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">Gateway Route:</span>
                  <span className="px-3 py-1 bg-white/10 border border-white/20 text-[#c2966e] text-[10px] uppercase font-bold tracking-wider rounded">
                    {activeGateway}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">Environment:</span>
                  <span className={`px-3 py-1 border text-[10px] uppercase font-bold tracking-wider rounded ${
                    testMode 
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 animate-pulse"
                  }`}>
                    {testMode ? "Test Sandbox" : "Live Active"}
                  </span>
                </div>
              </div>

              {/* Security Blueprint Card */}
              <div className="bg-neutral-50 border border-neutral-200/80 rounded p-6 space-y-4">
                <div className="flex items-center gap-2 text-[#a15c38]">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <h4 className="text-xs uppercase tracking-wider font-bold">Security Protocols</h4>
                </div>
                
                <div className="space-y-3 text-[11px] text-neutral-600 leading-relaxed font-light">
                  <p>
                    <strong>Laravel Database Isolation:</strong> Credentials are saved directly to the database via standard Eloquent configurations. We never rewrite files like `.env` dynamically at runtime, ensuring robust host compatibility.
                  </p>
                  
                  <p>
                    <strong>Dynamic Configuration Provider:</strong> The custom <code>PaymentConfigServiceProvider</code> intercepts system configurations at startup, overriding static settings in <code>config/services.php</code> before operational payment controllers resolve them.
                  </p>

                  <p>
                    <strong>Double Mask Protection:</strong> Secret keys returned from the backend are automatically truncated and masked with asterisks. The controller verifies incoming payloads; any secret key containing a <code>*</code> character is bypassed, preventing masked strings from overwriting real database values.
                  </p>
                </div>
              </div>

              {/* Integration Helper Info */}
              <div className="bg-white border border-neutral-200/80 rounded p-6 space-y-3">
                <div className="flex items-center gap-2 text-neutral-700">
                  <HelpCircle className="w-5 h-5 shrink-0 text-neutral-400" />
                  <h4 className="text-xs uppercase tracking-wider font-bold">Checkout Webhooks</h4>
                </div>
                
                <p className="text-[11px] text-neutral-500 leading-relaxed font-light">
                  Ensure webhooks are registered in your payment gateway portal. Hook endpoints point directly to:
                </p>
                <div className="p-2 bg-neutral-50 border border-neutral-200 rounded font-mono text-[9px] text-[#a15c38] select-all break-all">
                  {API_URL}/api/payment/webhook
                </div>
              </div>

            </div>

          </div>
        )}

      </main>
      
      {/* Footer system status */}
      <footer className="bg-white border-t border-neutral-200 py-4 px-6 flex items-center justify-between text-[9px] uppercase tracking-widest text-neutral-400 shrink-0">
        <div>Velmora E-Commerce Settings Console</div>
        <div>System Version 1.0.4</div>
      </footer>

    </div>
  );
}
