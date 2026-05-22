'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

// Luxury custom SVG icons to avoid Lucide React version mismatches
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const WhatsappIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-brand-clay">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: 'Order Status',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    // Simulate 1.5 second network request
    setTimeout(() => {
      setStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: 'Order Status',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Sticky Premium Navigation Header */}
      <Navbar />

      <main className="flex-1 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-10 text-[10px] uppercase tracking-widest text-gray-400">
            <ol className="flex items-center space-x-2">
              <li>
                <a href="/" className="hover:text-black transition-colors">Home</a>
              </li>
              <li>/</li>
              <li className="text-gray-900 font-semibold" aria-current="page">Contact Us</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Left Column: Brand & Customer Care Information */}
            <div className="flex flex-col justify-start">
              <h1 className="font-display text-4xl lg:text-5xl font-light tracking-wide text-gray-900 mb-6 uppercase">
                Contact Us
              </h1>
              
              <p className="font-sans text-gray-600 text-sm md:text-base leading-relaxed mb-12 max-w-md">
                We'd love to hear from you. Get in touch with the West Elm team for order inquiries, product information, or general questions.
              </p>

              {/* Customer Care Block */}
              <div className="space-y-6">
                
                {/* Phone Contact Block */}
                <div className="flex items-start pb-6 border-b border-gray-100">
                  <div className="text-brand-charcoal mt-0.5 p-2 bg-brand-sand">
                    <PhoneIcon />
                  </div>
                  <div className="ml-5">
                    <h3 className="font-display text-xs font-bold uppercase tracking-wider text-gray-900">
                      Phone Support
                    </h3>
                    <p className="font-mono text-sm font-semibold text-gray-900 mt-1">
                      1800 891 8888
                    </p>
                    <span className="text-[11px] text-gray-500 tracking-wide mt-0.5 block">
                      Toll-Free Number
                    </span>
                  </div>
                </div>

                {/* WhatsApp Support Block */}
                <div className="flex items-start pb-6 border-b border-gray-100">
                  <div className="text-brand-charcoal mt-0.5 p-2 bg-brand-sand">
                    <WhatsappIcon />
                  </div>
                  <div className="ml-5">
                    <h3 className="font-display text-xs font-bold uppercase tracking-wider text-gray-900">
                      WhatsApp Support
                    </h3>
                    <a
                      href="https://wa.me/919321412835"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm font-semibold text-gray-900 hover:text-brand-clay transition-colors mt-1 inline-block"
                    >
                      +91 9321 412 835
                    </a>
                    <span className="text-[11px] text-gray-500 tracking-wide mt-0.5 block">
                      Tap to start instant chat
                    </span>
                  </div>
                </div>

                {/* Email Support Block */}
                <div className="flex items-start pb-6 border-b border-gray-100">
                  <div className="text-brand-charcoal mt-0.5 p-2 bg-brand-sand">
                    <MailIcon />
                  </div>
                  <div className="ml-5">
                    <h3 className="font-display text-xs font-bold uppercase tracking-wider text-gray-900">
                      Email Inquiries
                    </h3>
                    <a
                      href="mailto:support@westelm.in"
                      className="font-sans text-sm font-semibold text-gray-900 hover:text-brand-clay transition-colors mt-1 inline-block"
                    >
                      support@westelm.in
                    </a>
                    <span className="text-[11px] text-gray-500 tracking-wide mt-0.5 block">
                      Typically replies in 24 hours
                    </span>
                  </div>
                </div>

                {/* Operating Hours Block */}
                <div className="flex items-start pb-6 border-b border-gray-100">
                  <div className="text-brand-charcoal mt-0.5 p-2 bg-brand-sand">
                    <ClockIcon />
                  </div>
                  <div className="ml-5">
                    <h3 className="font-display text-xs font-bold uppercase tracking-wider text-gray-900">
                      Operating Hours
                    </h3>
                    <p className="font-sans text-sm text-gray-600 mt-1 leading-relaxed">
                      Monday to Saturday <br />
                      <span className="font-semibold text-gray-900">10:00 AM to 7:00 PM</span>
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: High-Fidelity Interactive Form */}
            <div className="bg-white border border-gray-100 p-8 md:p-10 shadow-sm relative overflow-hidden">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success-state"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center text-center py-16 h-full"
                  >
                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                      <CheckIcon />
                    </div>
                    <h2 className="font-display text-lg font-bold uppercase tracking-widest text-gray-900 mb-3">
                      Message Sent
                    </h2>
                    <p className="font-sans text-gray-600 text-sm leading-relaxed max-w-sm">
                      Thank you for reaching out. A member of our team will get back to you shortly.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="mt-8 text-[10px] font-bold tracking-widest uppercase text-brand-charcoal border-b-2 border-brand-charcoal pb-0.5 hover:text-brand-clay hover:border-brand-clay transition-all duration-200"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h2 className="font-display text-base font-bold uppercase tracking-widest text-gray-900 mb-8 border-b border-gray-100 pb-3">
                      Send Us a Message
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      
                      {/* Name Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="firstName" className="block text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            First Name <span className="text-brand-clay">*</span>
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="John"
                            className="w-full border border-gray-300 p-3 rounded-none text-base md:text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors placeholder-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="lastName" className="block text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            Last Name <span className="text-brand-clay">*</span>
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Doe"
                            className="w-full border border-gray-300 p-3 rounded-none text-base md:text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors placeholder-gray-300"
                          />
                        </div>
                      </div>

                      {/* Email Address */}
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-widest text-gray-500">
                          Email Address <span className="text-brand-clay">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john.doe@example.com"
                          className="w-full border border-gray-300 p-3 rounded-none text-base md:text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors placeholder-gray-300"
                        />
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-[10px] font-bold uppercase tracking-widest text-gray-500">
                          Phone Number <span className="text-brand-clay">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full border border-gray-300 p-3 rounded-none text-base md:text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors placeholder-gray-300"
                        />
                      </div>

                      {/* Inquiry Type / Subject */}
                      <div className="space-y-2">
                        <label htmlFor="subject" className="block text-[10px] font-bold uppercase tracking-widest text-gray-500">
                          Subject / Inquiry Type <span className="text-brand-clay">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="subject"
                            name="subject"
                            required
                            value={formData.subject}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 p-3 rounded-none text-base md:text-sm bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors appearance-none cursor-pointer text-gray-900"
                          >
                            <option value="Order Status">Order Status</option>
                            <option value="Product Inquiry">Product Inquiry</option>
                            <option value="Returns/Exchanges">Returns/Exchanges</option>
                            <option value="Feedback">Feedback</option>
                            <option value="Other">Other</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="space-y-2">
                        <label htmlFor="message" className="block text-[10px] font-bold uppercase tracking-widest text-gray-500">
                          Message <span className="text-brand-clay">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="How can we help you today?"
                          className="w-full border border-gray-300 p-3 rounded-none text-base md:text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors placeholder-gray-300 resize-none"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full bg-black text-white uppercase tracking-widest text-xs md:text-sm font-semibold py-4 hover:bg-gray-800 transition-colors rounded-none cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed select-none"
                      >
                        {status === 'submitting' ? 'Sending...' : 'Send Message'}
                      </button>

                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </main>

      {/* Premium Multi-column Editorial Footer */}
      <Footer />
    </div>
  );
}
