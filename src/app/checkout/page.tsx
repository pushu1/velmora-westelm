'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, ShoppingBag, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { cart, clearCart } = useStore();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  
  // Checkout & simulated states
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [orderId, setOrderId] = useState('');

  const subtotal = cart.reduce((total, item) => {
    const price = item.product.discountPrice ?? item.product.basePrice;
    return total + price * item.quantity;
  }, 0);

  const shippingCost = subtotal > 49999 ? 0 : 999;
  const gstCost = subtotal * 0.18;
  const grandTotal = subtotal + shippingCost + (paymentMethod === 'cod' ? 250 : 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Handle success callback in search query parameters safely
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const isSuccess = params.get('success') === 'true';
      const orderRef = params.get('order_id');
      if (isSuccess && orderRef) {
        setOrderId(orderRef);
        setStep(3);
        clearCart();
        
        // Clean up URL parameters without reloading page
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [clearCart]);

  // Form validations
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!fullName.trim()) errors.fullName = 'Full Name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Valid Email is required';
    if (!phone.trim() || phone.length < 10) errors.phone = '10-digit Phone is required';
    if (!addressLine1.trim()) errors.addressLine1 = 'Address is required';
    if (!city.trim()) errors.city = 'City is required';
    if (!state.trim()) errors.state = 'State is required';
    if (!pincode.trim() || pincode.length !== 6) errors.pincode = '6-digit Pincode is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(2);
    }
  };

  // Simulated gateway processing steps
  const runPaymentSimulation = (callback: () => void) => {
    setSimulationStep(1); // Connecting to bank...
    setTimeout(() => {
      setSimulationStep(2); // Authorizing secure PIN...
      setTimeout(() => {
        setSimulationStep(3); // Verifying funds...
        setTimeout(() => {
          setSimulationStep(4); // Success!
          setTimeout(() => {
            callback();
          }, 800);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    if (paymentMethod === 'cod') {
      const generatedOrderId = `WE-${Math.floor(100000 + Math.random() * 900000)}-COD`;
      setOrderId(generatedOrderId);
      runPaymentSimulation(() => {
        setIsProcessing(false);
        setStep(3);
        clearCart();
      });
      return;
    }

    // Connect to real Laravel PaymentController for Stripe Checkout session provisioning
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const payloadItems = cart.map((item) => ({
        product_id: Number(item.product.id),
        quantity: item.quantity,
      }));

      const res = await fetch(`${apiUrl}/api/payment/checkout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          items: payloadItems,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || errData.message || 'Checkout initialization failed');
      }

      const sessionData = await res.json();

      if (sessionData.session_url) {
        // Redirect browser viewport to Stripe Checkout (or mock complete success URL)
        window.location.href = sessionData.session_url;
      } else {
        throw new Error('Stripe Checkout Session URL was not returned by the backend.');
      }
    } catch (err: any) {
      console.error('Checkout processing error:', err);
      setIsProcessing(false);
      alert(`Stripe Checkout failed: ${err.message || 'Check your backend server is online'}. Please try simulated Cash On Delivery instead!`);
    }
  };

  // Redirection block if cart is empty and not on Success step
  if (cart.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-brand-sand flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-brand-grey p-8 text-center space-y-6 shadow-md">
          <ShoppingBag className="w-12 h-12 text-brand-grey-dark mx-auto stroke-[1.25]" />
          <h2 className="font-display font-semibold text-lg tracking-wider uppercase text-brand-charcoal">
            Your Bag is Empty
          </h2>
          <p className="text-xs text-brand-grey-dark leading-relaxed">
            You must add our premium signature designs to your bag before proceeding to secure checkout.
          </p>
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center space-x-2 py-3.5 bg-brand-charcoal text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-clay transition-all duration-300"
          >
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-brand-charcoal select-none flex flex-col justify-between">
      {/* Checkout Locked Minimal Header */}
      <header className="bg-white border-b border-brand-grey py-5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <Link href="/">
            <span className="font-display text-lg font-bold tracking-[0.35em] text-brand-charcoal uppercase">
              west elm
            </span>
          </Link>
          <div className="flex items-center space-x-2 text-xs font-bold tracking-widest uppercase text-brand-grey-dark">
            <Lock className="w-4 h-4 text-brand-clay" />
            <span className="hidden sm:inline">Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Checkout Viewport */}
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-10 w-full">
        {/* Step progress tracker */}
        {step !== 3 && (
          <div className="max-w-xl mx-auto mb-10">
            <div className="flex justify-between items-center relative">
              {/* Connector line */}
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-brand-grey -translate-y-1/2 z-0" />
              <div
                className="absolute left-0 top-1/2 h-0.5 bg-brand-clay -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: step === 2 ? '100%' : '0%' }}
              />

              {[
                { number: 1, label: 'Shipping Address' },
                { number: 2, label: 'Review & Pay' },
              ].map((s) => (
                <div key={s.number} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      step >= s.number
                        ? 'border-brand-clay bg-brand-clay text-white shadow-sm'
                        : 'border-brand-grey bg-white text-brand-grey-dark'
                    }`}
                  >
                    {s.number}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest mt-2 bg-[#fcfaf7] px-2 text-brand-charcoal">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 3 ? (
            /* --- STEP 3: ORDER SUCCESS SCREEN --- */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto bg-white border border-brand-grey p-8 md:p-12 text-center space-y-6 shadow-md"
            >
              <CheckCircle2 className="w-16 h-16 text-brand-clay mx-auto stroke-[1.25]" />
              
              <div className="space-y-2">
                <span className="font-display font-semibold text-[10px] tracking-[0.25em] uppercase text-brand-clay">
                  Purchase Completed
                </span>
                <h2 className="font-display font-bold text-2xl md:text-3xl tracking-wide uppercase">
                  Thank You For Your Order
                </h2>
                <p className="text-xs text-brand-grey-dark leading-relaxed font-normal">
                  Your flagship home sanctuary is officially booked. A curated receipt has been sent to{' '}
                  <span className="font-semibold text-brand-charcoal">{email}</span>.
                </p>
              </div>

              {/* Order Receipt Card */}
              <div className="bg-brand-sand/50 border border-brand-grey p-5 text-left divide-y divide-brand-grey/50 space-y-4">
                <div className="pb-3 flex justify-between items-center text-xs">
                  <div>
                    <p className="text-[10px] text-brand-grey-dark uppercase tracking-wider">Order Reference</p>
                    <p className="font-mono font-bold text-brand-charcoal mt-0.5">{orderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-brand-grey-dark uppercase tracking-wider">Est. Delivery</p>
                    <p className="font-semibold text-brand-clay mt-0.5">3-5 Business Days</p>
                  </div>
                </div>

                <div className="py-3 text-xs">
                  <p className="text-[10px] text-brand-grey-dark uppercase tracking-wider mb-1.5">Shipping Destination</p>
                  <p className="font-semibold text-brand-charcoal">{fullName}</p>
                  <p className="text-brand-grey-dark leading-relaxed font-normal mt-0.5">
                    {addressLine1}, {addressLine2 ? `${addressLine2}, ` : ''}{city}, {state} - {pincode}
                  </p>
                  <p className="text-brand-grey-dark mt-1 font-mono">Mobile: {phone}</p>
                </div>

                <div className="pt-3 flex justify-between items-center text-xs font-semibold text-brand-charcoal">
                  <span className="font-display uppercase tracking-widest">Total Transaction Value</span>
                  <span className="font-mono">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Link
                  href="/"
                  className="w-full inline-flex items-center justify-center space-x-2 py-4 bg-brand-charcoal text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-clay transition-all duration-300 group"
                >
                  <span>Continue Curating Designs</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <p className="text-[10px] text-brand-grey-dark leading-relaxed">
                  Need post-order interior revisions? Use our complimentary 24/7 Design Chat.
                </p>
              </div>
            </motion.div>
          ) : (
            /* --- STEP 1 & 2: DUAL-COLUMN SHIPPING & PAYMENT --- */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Forms Area */}
              <div className="lg:col-span-7 bg-white border border-brand-grey p-5 md:p-8 shadow-sm">
                
                {step === 1 && (
                  /* --- STEP 1: SHIPPING ADDRESS --- */
                  <form onSubmit={handleProceedToPayment} className="space-y-6">
                    <div className="border-b border-brand-sand pb-3">
                      <h2 className="font-display font-semibold text-sm tracking-wider uppercase text-brand-charcoal">
                        Shipping Address
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal">Full Name</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="border border-brand-grey py-2.5 px-3 text-xs focus:outline-none focus:border-brand-charcoal focus:bg-white bg-brand-sand/30"
                          placeholder="e.g. Yuvraj Singh"
                        />
                        {formErrors.fullName && <p className="text-[10px] text-brand-clay font-semibold">{formErrors.fullName}</p>}
                      </div>

                      {/* Phone */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal">Contact Mobile</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="border border-brand-grey py-2.5 px-3 text-xs focus:outline-none focus:border-brand-charcoal focus:bg-white bg-brand-sand/30"
                          placeholder="e.g. 9876543210"
                        />
                        {formErrors.phone && <p className="text-[10px] text-brand-clay font-semibold">{formErrors.phone}</p>}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-brand-grey py-2.5 px-3 text-xs focus:outline-none focus:border-brand-charcoal focus:bg-white bg-brand-sand/30"
                        placeholder="e.g. signature@designer.com"
                      />
                      {formErrors.email && <p className="text-[10px] text-brand-clay font-semibold">{formErrors.email}</p>}
                    </div>

                    {/* Address Line 1 */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal">Address Line 1</label>
                      <input
                        type="text"
                        required
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        className="border border-brand-grey py-2.5 px-3 text-xs focus:outline-none focus:border-brand-charcoal focus:bg-white bg-brand-sand/30"
                        placeholder="Flat/House No., Building Name, Street"
                      />
                      {formErrors.addressLine1 && <p className="text-[10px] text-brand-clay font-semibold">{formErrors.addressLine1}</p>}
                    </div>

                    {/* Address Line 2 */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal">Address Line 2 (Optional)</label>
                      <input
                        type="text"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        className="border border-brand-grey py-2.5 px-3 text-xs focus:outline-none focus:border-brand-charcoal focus:bg-white bg-brand-sand/30"
                        placeholder="Landmark, Area, Colony"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Pincode */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal">Pincode</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="border border-brand-grey py-2.5 px-3 text-xs focus:outline-none focus:border-brand-charcoal focus:bg-white bg-brand-sand/30"
                          placeholder="6-digit PIN"
                        />
                        {formErrors.pincode && <p className="text-[10px] text-brand-clay font-semibold">{formErrors.pincode}</p>}
                      </div>

                      {/* City */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal">City</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="border border-brand-grey py-2.5 px-3 text-xs focus:outline-none focus:border-brand-charcoal focus:bg-white bg-brand-sand/30"
                          placeholder="Mumbai"
                        />
                        {formErrors.city && <p className="text-[10px] text-brand-clay font-semibold">{formErrors.city}</p>}
                      </div>

                      {/* State */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal">State</label>
                        <input
                          type="text"
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="border border-brand-grey py-2.5 px-3 text-xs focus:outline-none focus:border-brand-charcoal focus:bg-white bg-brand-sand/30"
                          placeholder="Maharashtra"
                        />
                        {formErrors.state && <p className="text-[10px] text-brand-clay font-semibold">{formErrors.state}</p>}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full h-12 bg-brand-charcoal text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-clay transition-all duration-300 flex items-center justify-center space-x-2 shadow-md group cursor-pointer"
                      >
                        <span>Proceed to Payment</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </div>
                  </form>
                )}

                {step === 2 && (
                  /* --- STEP 2: REVIEW & PAY --- */
                  <div className="space-y-6">
                    <div className="border-b border-brand-sand pb-3 flex items-center justify-between">
                      <h2 className="font-display font-semibold text-sm tracking-wider uppercase text-brand-charcoal">
                        Review & Complete Payment
                      </h2>
                      <button
                        onClick={() => setStep(1)}
                        className="text-[10px] font-bold text-brand-grey-dark hover:text-brand-charcoal flex items-center space-x-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Edit Address</span>
                      </button>
                    </div>

                    {/* Shipping Address Summary card */}
                    <div className="p-4 bg-brand-sand/50 border border-brand-grey text-xs space-y-1">
                      <p className="text-[10px] text-brand-grey-dark uppercase tracking-wider font-semibold">Shipping Destination</p>
                      <p className="font-semibold">{fullName}</p>
                      <p className="text-brand-grey-dark font-normal leading-relaxed">
                        {addressLine1}, {addressLine2 ? `${addressLine2}, ` : ''}{city}, {state} - {pincode}
                      </p>
                      <p className="text-brand-grey-dark font-mono mt-0.5">Mobile: {phone}</p>
                    </div>

                    {/* Select Payment gateway method */}
                    <div className="space-y-3 pt-2">
                      <h3 className="font-display font-semibold text-xs tracking-wider uppercase text-brand-charcoal">
                        Select Payment Option
                      </h3>
                      
                      <div className="space-y-3">
                        {/* Razorpay Gateway */}
                        <label
                          className={`flex items-start justify-between p-4 border cursor-pointer transition-all duration-200 select-none ${
                            paymentMethod === 'razorpay'
                              ? 'border-brand-clay bg-brand-sand/30 shadow-sm'
                              : 'border-brand-grey hover:border-brand-charcoal'
                          }`}
                        >
                          <div className="flex space-x-3.5">
                            <input
                              type="radio"
                              name="payment-option"
                              checked={paymentMethod === 'razorpay'}
                              onChange={() => setPaymentMethod('razorpay')}
                              className="w-4 h-4 mt-0.5 border-brand-grey text-brand-charcoal focus:ring-0 cursor-pointer"
                            />
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider">Razorpay Gateway (UPI, Card, NetBanking)</p>
                              <p className="text-[10px] text-brand-grey-dark leading-relaxed font-normal mt-0.5">
                                Fully secure payment interface supporting instant test UPI and credit cards.
                              </p>
                            </div>
                          </div>
                          <span className="text-[9px] font-bold text-brand-clay tracking-widest bg-brand-clay/10 px-2 py-0.5 uppercase hidden sm:inline">
                            Recommended
                          </span>
                        </label>

                        {/* Simulated COD */}
                        <label
                          className={`flex items-start p-4 border cursor-pointer transition-all duration-200 select-none ${
                            paymentMethod === 'cod'
                              ? 'border-brand-clay bg-brand-sand/30 shadow-sm'
                              : 'border-brand-grey hover:border-brand-charcoal'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment-option"
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                            className="w-4 h-4 mt-0.5 mr-3.5 border-brand-grey text-brand-charcoal focus:ring-0 cursor-pointer"
                          />
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider">Cash On Delivery (Simulated)</p>
                            <p className="text-[10px] text-brand-grey-dark leading-relaxed font-normal mt-0.5">
                              Pay on delivery. Incurs simulated handling convenience fee of ₹250.
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Trust assurances */}
                    <div className="flex items-center space-x-2.5 p-3.5 bg-brand-sand border border-brand-grey/50">
                      <ShieldCheck className="w-5 h-5 text-brand-clay flex-shrink-0" />
                      <p className="text-[10px] text-brand-grey-dark leading-relaxed font-normal">
                        Your transaction details are shielded via 256-bit Secure Sockets Layer (SSL) encryption, preventing unauthorised access.
                      </p>
                    </div>

                    <div className="pt-4 flex space-x-4">
                      <button
                        onClick={() => setStep(1)}
                        className="px-5 border border-brand-charcoal text-brand-charcoal text-xs font-bold uppercase tracking-widest hover:bg-brand-sand transition-all cursor-pointer flex items-center justify-center space-x-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Address</span>
                      </button>
                      
                      <button
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="flex-1 h-12 bg-brand-charcoal text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-clay transition-all duration-300 flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            <span>Processing Transaction...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>Complete Order ({formatPrice(grandTotal)})</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Dynamic Sidebar Summary (Columns 8-12) */}
              <div className="lg:col-span-5 bg-brand-sand/50 border border-brand-grey p-5 md:p-6 shadow-sm space-y-6">
                <h3 className="font-display font-semibold text-xs tracking-wider uppercase text-brand-charcoal border-b border-brand-grey pb-3">
                  Order Details ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </h3>

                {/* Items loop */}
                <div className="divide-y divide-brand-grey/30 max-h-[320px] overflow-y-auto pr-1 space-y-3.5">
                  {cart.map((item) => {
                    const price = item.product.discountPrice ?? item.product.basePrice;
                    return (
                      <div key={item.variant.sku} className="flex space-x-3.5 pt-3.5 first:pt-0">
                        <div className="relative aspect-[3/4] w-12 overflow-hidden bg-white border border-brand-grey/50">
                          <Image
                            src={item.variant.imageUrls[0] || (item.product as any).variants?.[0]?.imageUrls[0]}
                            alt={item.product.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <h4 className="font-display font-semibold text-[11px] text-brand-charcoal truncate">
                              {item.product.title}
                            </h4>
                            <p className="text-[9px] text-brand-grey-dark uppercase tracking-wider mt-0.5">
                              Finish: {item.variant.colorName}
                            </p>
                            <p className="text-[9px] text-brand-grey-dark font-mono">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="font-mono text-xs font-semibold text-brand-charcoal text-right mt-1.5">
                            {formatPrice(price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pricing Summary list */}
                <div className="border-t border-brand-grey pt-4 space-y-2.5 text-xs text-brand-grey-dark">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-brand-charcoal font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18% Included)</span>
                    <span className="font-mono">{formatPrice(gstCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Convenience</span>
                    {shippingCost === 0 ? (
                      <span className="text-brand-clay font-bold uppercase tracking-wider">FREE</span>
                    ) : (
                      <span className="font-mono text-brand-charcoal">{formatPrice(shippingCost)}</span>
                    )}
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="flex justify-between">
                      <span>COD Convenience Fee</span>
                      <span className="font-mono text-brand-charcoal">{formatPrice(250)}</span>
                    </div>
                  )}
                  <div className="border-t border-brand-grey/50 pt-3 flex justify-between text-sm font-bold text-brand-charcoal">
                    <span className="font-display uppercase tracking-widest">Grand Total</span>
                    <span className="font-mono">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Safe secure assurance */}
                <div className="text-[10px] text-brand-grey-dark font-normal flex items-start space-x-1.5 border-t border-brand-grey/30 pt-4 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-brand-clay flex-shrink-0" />
                  <span>Your payment is secured and guaranteed by verified Test UPI protocols. No real funds are deducted during mock preview.</span>
                </div>
              </div>

            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Simulated Payment Processing Custom Modal overlay */}
      <AnimatePresence>
        {isProcessing && simulationStep > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 text-center select-none"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-xs w-full bg-white border border-brand-grey p-6 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-center">
                {simulationStep < 4 ? (
                  <Loader2 className="w-10 h-10 animate-spin text-brand-clay" />
                ) : (
                  <CheckCircle2 className="w-12 h-12 text-green-600 stroke-[1.25]" />
                )}
              </div>

              <div className="space-y-2">
                <span className="font-display font-semibold text-[10px] tracking-[0.25em] uppercase text-brand-clay">
                  Secure Bank Link
                </span>
                <h3 className="font-display font-bold text-sm tracking-wider uppercase">
                  Processing Gateway
                </h3>
              </div>

              {/* Steps ticks */}
              <div className="text-left text-xs space-y-3 pl-4 border-l-2 border-brand-sand">
                <div className="flex items-center space-x-2.5">
                  <span className={`w-3.5 h-3.5 rounded-full text-[9px] font-bold flex items-center justify-center ${
                    simulationStep >= 1 ? 'bg-brand-clay text-white' : 'bg-brand-sand text-brand-grey-dark'
                  }`}>
                    {simulationStep > 1 ? '✓' : '1'}
                  </span>
                  <span className={simulationStep === 1 ? 'font-semibold text-brand-charcoal' : 'text-brand-grey-dark font-normal'}>
                    Connecting to secure bank...
                  </span>
                </div>
                
                <div className="flex items-center space-x-2.5">
                  <span className={`w-3.5 h-3.5 rounded-full text-[9px] font-bold flex items-center justify-center ${
                    simulationStep >= 2 ? 'bg-brand-clay text-white' : 'bg-brand-sand text-brand-grey-dark'
                  }`}>
                    {simulationStep > 2 ? '✓' : '2'}
                  </span>
                  <span className={simulationStep === 2 ? 'font-semibold text-brand-charcoal' : 'text-brand-grey-dark font-normal'}>
                    Authorizing secure PIN...
                  </span>
                </div>

                <div className="flex items-center space-x-2.5">
                  <span className={`w-3.5 h-3.5 rounded-full text-[9px] font-bold flex items-center justify-center ${
                    simulationStep >= 3 ? 'bg-brand-clay text-white' : 'bg-brand-sand text-brand-grey-dark'
                  }`}>
                    {simulationStep > 3 ? '✓' : '3'}
                  </span>
                  <span className={simulationStep === 3 ? 'font-semibold text-brand-charcoal' : 'text-brand-grey-dark font-normal'}>
                    Verifying transaction funds...
                  </span>
                </div>

                <div className="flex items-center space-x-2.5">
                  <span className={`w-3.5 h-3.5 rounded-full text-[9px] font-bold flex items-center justify-center ${
                    simulationStep >= 4 ? 'bg-green-600 text-white' : 'bg-brand-sand text-brand-grey-dark'
                  }`}>
                    {simulationStep === 4 ? '✓' : '4'}
                  </span>
                  <span className={simulationStep === 4 ? 'font-semibold text-green-600' : 'text-brand-grey-dark font-normal'}>
                    Order transaction successful!
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simple Footer footnote */}
      <footer className="bg-white border-t border-brand-grey py-4 text-center">
        <p className="text-[10px] text-brand-grey-dark">
          © {new Date().getFullYear()} West Elm India Secure Terminal. Fully encrypted mock preview.
        </p>
      </footer>
    </div>
  );
}
