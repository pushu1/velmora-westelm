'use client';

import React, { useState } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

// Flagship store data schema
interface StoreLocation {
  id: string;
  name: string;
  mall: string;
  city: string;
  address: string;
  hours: string;
  phone: string;
  googleMapQuery: string;
  directionsUrl: string;
  amenities: string[];
}

const STORE_LOCATIONS: StoreLocation[] = [
  {
    id: 'bkc-mumbai',
    name: 'West Elm Jio World Drive',
    mall: 'Jio World Drive, Mumbai',
    city: 'Mumbai',
    address: 'Ground Floor, MAKER MAXITY, Bandra Kurla Complex Rd, Bandra East, Mumbai, Maharashtra 400051',
    hours: 'Mon - Sun: 11:00 AM - 10:00 PM',
    phone: '+91 85914 04145',
    googleMapQuery: 'Maker+Maxity+Bandra+Kurla+Complex+Mumbai',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Maker+Maxity+Bandra+Kurla+Complex+Mumbai',
    amenities: [
      'In-Store Design Crew Consultation',
      'Premium Custom Swatch Gallery',
      'FSC® Certified Furniture Display',
      'Store Pickup Available'
    ]
  },
  {
    id: 'ambience-gurugram',
    name: 'West Elm Ambience Mall',
    mall: 'Ambience Mall, Gurugram',
    city: 'Gurugram',
    address: 'West Elm Store, NH-8, Ambience Island, DLF Phase 3, Sector 24, Gurugram, Haryana 122010',
    hours: 'Mon - Sun: 11:00 AM - 10:00 PM',
    phone: '+91 124 402 9097',
    googleMapQuery: 'Ambience+Mall+Gurugram+West+Elm',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Ambience+Mall+Gurugram+West+Elm',
    amenities: [
      'In-Store Design Crew Consultation',
      'Rug Selection Studio',
      'White Glove Service Logistics Desk',
      'Store Pickup Available'
    ]
  }
];

export default function FindAStorePage() {
  const [selectedStore, setSelectedStore] = useState<StoreLocation | null>(null);

  // Dynamic Google Map Embed URL generation based on active selection
  const getMapEmbedUrl = () => {
    if (selectedStore) {
      return `https://maps.google.com/maps?q=${selectedStore.googleMapQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
    }
    // Default: Center of India (showing both major hubs Gurugram & Mumbai)
    return `https://maps.google.com/maps?q=20.5937,78.9629&t=&z=5&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Sticky Premium Navigation Header */}
      <Navbar />

      <main className="flex-1 flex flex-col bg-white">
        
        {/* Full-width clean page header */}
        <section className="bg-brand-sand py-10 border-b border-brand-grey text-center">
          <div className="max-w-7xl mx-auto px-4">
            <nav aria-label="Breadcrumb" className="mb-3 text-[10px] uppercase tracking-widest text-gray-400">
              <ol className="flex items-center justify-center space-x-2">
                <li>
                  <a href="/" className="hover:text-black transition-colors">Home</a>
                </li>
                <li>/</li>
                <li className="text-gray-900 font-semibold" aria-current="page">Store Locator</li>
              </ol>
            </nav>
            <h1 className="font-display text-3xl md:text-4xl font-light tracking-[0.2em] text-brand-charcoal uppercase">
              Find a Store
            </h1>
            <p className="text-xs text-brand-grey-dark uppercase tracking-widest mt-2">
              Visit our Flagship Locations across India
            </p>
          </div>
        </section>

        {/* Split Screen Grid (touches margins) */}
        <section className="w-full grid grid-cols-1 md:grid-cols-12 h-auto md:h-[800px] border-b border-brand-grey">
          
          {/* Left Column: Scrollable Store Cards Directory */}
          <div className="md:col-span-4 flex flex-col h-full bg-white md:border-r border-brand-grey overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-brand-grey flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-clay">
                {STORE_LOCATIONS.length} Flagship Stores
              </span>
              <button
                onClick={() => setSelectedStore(null)}
                className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${
                  selectedStore ? 'text-brand-charcoal hover:text-brand-clay' : 'text-gray-300 cursor-default'
                }`}
                disabled={!selectedStore}
              >
                Reset Map view
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {STORE_LOCATIONS.map((store) => {
                const isSelected = selectedStore?.id === store.id;
                return (
                  <div
                    key={store.id}
                    onClick={() => setSelectedStore(store)}
                    className={`group p-6 text-left transition-all duration-300 cursor-pointer relative ${
                      isSelected
                        ? 'bg-brand-sand/55 border-l-4 border-brand-charcoal pl-5'
                        : 'hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold tracking-wider uppercase bg-brand-charcoal text-white px-2 py-0.5 mb-2.5 inline-block">
                        {store.city}
                      </span>
                    </div>

                    <h2 className="font-display text-base font-bold tracking-wide text-gray-900 group-hover:text-brand-clay transition-colors duration-200 uppercase">
                      {store.name}
                    </h2>
                    
                    <p className="font-sans text-xs text-gray-500 mt-2 leading-relaxed">
                      {store.address}
                    </p>

                    <div className="mt-4 space-y-1.5 font-sans text-xs text-gray-600 border-t border-dashed border-gray-200/60 pt-3">
                      <p className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900 uppercase text-[9px] tracking-wider w-12 block">Hours:</span>
                        <span>{store.hours}</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900 uppercase text-[9px] tracking-wider w-12 block">Phone:</span>
                        <a href={`tel:${store.phone.replace(/\s+/g, '')}`} className="font-mono hover:text-brand-clay transition-colors">
                          {store.phone}
                        </a>
                      </p>
                    </div>

                    {/* Inside Amenities expansion details when active */}
                    {isSelected && (
                      <div className="mt-5 bg-white p-3 border border-brand-grey/60 space-y-1.5 animate-fadeIn">
                        <span className="text-[8px] font-bold uppercase tracking-wider text-brand-clay block border-b border-gray-100 pb-1">
                          In-Store Facilities
                        </span>
                        {store.amenities.map((amenity, idx) => (
                          <div key={idx} className="flex items-center space-x-1.5 text-[10px] text-gray-600">
                            <span className="w-1 h-1 bg-brand-clay rounded-full" />
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex flex-wrap gap-4">
                      <a
                        href={store.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()} // Prevents toggling active selection
                        className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal hover:text-brand-clay underline decoration-brand-charcoal hover:decoration-brand-clay transition-all duration-200"
                      >
                        Get Directions
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStore(store);
                        }}
                        className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal hover:text-brand-clay underline decoration-brand-charcoal hover:decoration-brand-clay transition-all duration-200"
                      >
                        Store Details
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Dynamic Embedded Google Map Container */}
          <div className="md:col-span-8 h-[400px] md:h-full bg-brand-sand relative overflow-hidden flex flex-col justify-stretch">
            
            {/* Visual Floating map status bar */}
            <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-[2px] border border-brand-grey p-3 shadow-md z-10 flex items-center justify-between text-left gap-4 max-w-sm rounded">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-900">
                  {selectedStore ? selectedStore.name : 'All flagship stores'}
                </p>
                <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">
                  {selectedStore ? `Displaying ${selectedStore.city} Location` : 'Zoomed to India Flagship Overview'}
                </p>
              </div>
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
            </div>

            {/* Google Map Embedded iframe */}
            <iframe
              src={getMapEmbedUrl()}
              width="100%"
              height="100%"
              style={{ border: 0, flex: 1 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="West Elm Flagship Store Map Location Locator"
              className="w-full h-full min-h-[400px] md:min-h-full"
            />
          </div>

        </section>

        {/* Minimalist Design Callout */}
        <section className="bg-brand-sand py-12 border-b border-brand-grey text-center">
          <div className="max-w-xl mx-auto px-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-brand-charcoal mb-2">
              Free Expert Design Consultation
            </h3>
            <p className="font-sans text-xs text-brand-grey-dark leading-relaxed mb-5">
              Need assistance styling a bedroom or furnishing an entire layout? Our complimentary Design Crew service is active inside all flagships or available virtually online.
            </p>
            <a
              href="/design-crew"
              className="inline-block text-[10px] font-bold tracking-widest uppercase border-b-2 border-brand-charcoal pb-0.5 text-brand-charcoal hover:text-brand-clay hover:border-brand-clay transition-colors duration-200"
            >
              Learn About Design Services
            </a>
          </div>
        </section>

      </main>

      {/* Premium Multi-column Editorial Footer */}
      <Footer />
    </div>
  );
}
