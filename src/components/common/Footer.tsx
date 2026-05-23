'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, MapPin, ShieldCheck, HeartHandshake } from 'lucide-react';

// Custom Brand SVG Icons since modern Lucide versions do not package social logos
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#111111] text-[#f6f4f0] pt-16 pb-8 border-t border-brand-charcoal">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Top Features Panel (Value Propositions) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-brand-charcoal mb-12">
          <div className="flex items-start space-x-4">
            <ShieldCheck className="w-6 h-6 text-brand-clay flex-shrink-0" />
            <div>
              <h4 className="font-display font-semibold text-xs tracking-wider uppercase text-white">
                Premium FSC® Certified
              </h4>
              <p className="text-[11px] text-[#c5c5c5] mt-1.5 leading-relaxed">
                Sustainably sourced woods engineered to last generations. Environmentally conscious by design.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <HeartHandshake className="w-6 h-6 text-brand-clay flex-shrink-0" />
            <div>
              <h4 className="font-display font-semibold text-xs tracking-wider uppercase text-white">
                Complimentary Design Chat
              </h4>
              <p className="text-[11px] text-[#c5c5c5] mt-1.5 leading-relaxed">
                Need professional layout advice? Consult our spatial designers online or in-store for free.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <MapPin className="w-6 h-6 text-brand-clay flex-shrink-0" />
            <div>
              <h4 className="font-display font-semibold text-xs tracking-wider uppercase text-white">
                Flagship Experience
              </h4>
              <p className="text-[11px] text-[#c5c5c5] mt-1.5 leading-relaxed">
                Visit our physical showrooms in Mumbai, Delhi, and Bangalore to feel our hand-tufted fabrics in person.
              </p>
            </div>
          </div>
        </div>

        {/* Multi-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 xl:gap-12 mb-16">
          
          {/* Col 1: We're Here To Help */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-display font-bold text-xs tracking-widest uppercase text-white">
              We're Here To Help
            </h3>
            <ul className="space-y-2.5">
              {[
                { name: "Contact Us", href: "/contact-us" },
                { name: "Fees & Payments", href: "/fees-and-payments" },
                { name: "Delivery Policy", href: "/delivery-policy" },
                { name: "Measure for Delivery", href: "/measure-for-delivery" },
                { name: "Returns & Exchange Policy", href: "/returns-and-exchange" },
                { name: "White Glove Services", href: "/white-glove-services" },
                { name: "west elm TRADE", href: "/trade" }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-xs text-[#c5c5c5] hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: About Us */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-display font-bold text-xs tracking-widest uppercase text-white">
              About Us
            </h3>
            <ul className="space-y-2.5">
              {[
                { name: "Our Values", href: "/our-values" }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-xs text-[#c5c5c5] hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Stores */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-display font-bold text-xs tracking-widest uppercase text-white">
              Stores
            </h3>
            <ul className="space-y-2.5">
              {[
                { name: "Find A Store", href: "/find-a-store" },
                { name: "Design Crew", href: "/design-crew" }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-xs text-[#c5c5c5] hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="flex flex-col space-y-4 sm:col-span-2 lg:col-span-2">
            <h3 className="font-display font-bold text-xs tracking-widest uppercase text-white">
              Join The Collection
            </h3>
            <p className="text-xs text-[#c5c5c5] leading-relaxed">
              Sign up to receive 15% off your first order, early access to capsule collections, and bespoke interior styling guides.
            </p>
            {subscribed ? (
              <div className="bg-[#1e1e1e] border border-brand-clay p-4 text-center">
                <p className="text-xs text-brand-clay font-semibold uppercase tracking-wider">
                  🎉 Welcome! Check your inbox for code: WELCOMEWE
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col space-y-2.5">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-brand-charcoal text-xs text-white py-3 pl-3 pr-10 focus:outline-none focus:border-brand-clay transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-0.5 top-0.5 bottom-0.5 px-3 flex items-center justify-center text-[#c5c5c5] hover:text-white transition-colors duration-200 cursor-pointer"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-brand-grey-dark leading-relaxed">
                  By joining, you consent to our Privacy Policy and can unsubscribe at any time.
                </p>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Credits & Legalities */}
        <div className="border-t border-[#222222] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start space-y-1">
            {/* <span className="font-display text-sm font-semibold tracking-[0.25em] text-white uppercase select-none">
              WEST ELM INDIA
            </span> */}

            <img
  src="/valmoralivinglogo.png"
  alt="Valmora Living"
  className="h-12 w-auto object-contain"
/>
            <p className="text-[10px] text-brand-grey-dark text-center md:text-left mt-1">
              © {new Date().getFullYear()} Reliance Brands Limited. Licenced replica of West Elm. All rights reserved.
            </p>
          </div>

          {/* Social icons */}
          <div className="flex items-center space-x-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-[#222222] text-[#c5c5c5] hover:text-white rounded-full transition-colors duration-200" aria-label="Instagram handle">
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-[#222222] text-[#c5c5c5] hover:text-white rounded-full transition-colors duration-200" aria-label="Facebook handle">
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-[#222222] text-[#c5c5c5] hover:text-white rounded-full transition-colors duration-200" aria-label="YouTube handle">
              <YoutubeIcon className="w-4 h-4" />
            </a>
          </div>

          {/* Legal / Policies links */}
          <div className="flex items-center space-x-5 text-[10px] text-brand-grey-dark uppercase tracking-wider font-semibold">
            <Link href="/pages/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/pages/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/pages/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
