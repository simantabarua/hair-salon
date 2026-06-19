'use client';

import React, { useState } from 'react';
import { Check, Plus, Minus, Calendar, ShoppingCart, HelpCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import PageHeading from '@/components/layout/PageHeading';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

interface PriceItem {
  id: string;
  name: string;
  price: number;
  description: string;
}

const PRICING_DATA: Record<string, PriceItem[]> = {
  'hair-cut': [
    { id: 'hc_1', name: 'Crew Cut', price: 65, description: 'Suited to Fuzzy and Curly Hair' },
    { id: 'hc_2', name: 'Caesar Cut', price: 70, description: 'Classic styled crop cut' },
    { id: 'hc_3', name: 'Tempel Fade', price: 65, description: 'Modern sleek temple fade' },
    { id: 'hc_4', name: 'Long Top Short Sides', price: 80, description: 'Premium top volume cut' },
    { id: 'hc_5', name: 'Fade Haircut', price: 65, description: 'Mid/Low precision drop fade' },
    { id: 'hc_6', name: 'Undercut Style', price: 75, description: 'Disconnected modern undercut' }
  ],
  'shaving': [
    { id: 'sh_1', name: 'Classic Hot Towel Shave', price: 45, description: 'Traditional straight razor shave' },
    { id: 'sh_2', name: 'Beard Trim & Detail', price: 35, description: 'Beard shaping and lining' },
    { id: 'sh_3', name: 'Royal Shaving Package', price: 55, description: 'Premium oil pre-shave & aftershave mask' },
    { id: 'sh_4', name: 'Mustache Styling', price: 25, description: 'Clean lining and mustache wax style' }
  ],
  'hair-dye': [
    { id: 'hd_1', name: 'Single Process Color', price: 95, description: 'Root touch-up or full solid color' },
    { id: 'hd_2', name: 'Highlights / Lowlights', price: 140, description: 'Dimension adding premium foil work' },
    { id: 'hd_3', name: 'Balayage Treatment', price: 180, description: 'Hand-painted natural glow gradients' },
    { id: 'hd_4', name: 'Creative / Pastel Tone', price: 160, description: 'Vibrant custom fashion dye' }
  ],
  'facial': [
    { id: 'fa_1', name: 'Hydrating Facial', price: 85, description: 'Deep moisture restoration & steaming' },
    { id: 'fa_2', name: 'Microdermabrasion', price: 110, description: 'Non-invasive skin resurfacing treatment' },
    { id: 'fa_3', name: 'Pumpkin Peel', price: 95, description: 'Exfoliating enzyme natural peel' },
    { id: 'fa_4', name: 'Glycolic Peel', price: 105, description: 'Deeper cellular skin renewal peel' }
  ],
  'keratin': [
    { id: 'ke_1', name: 'The Brazilian Blowdry', price: 250, description: 'Maximum frizz reduction and straightening' },
    { id: 'ke_2', name: 'Japzilian Treatment', price: 320, description: 'High strength hybrid keratin smoothing' },
    { id: 'ke_3', name: 'Soft Keratin Treatment', price: 210, description: 'Medium strength styling hydration' },
    { id: 'ke_4', name: 'Express Keratin Shot', price: 140, description: 'Quick frizz control touch-up' }
  ]
};

const PACKAGES = [
  {
    id: 'pkg_grooming',
    name: 'Grooming Package',
    price: 499,
    features: [
      'Hair Cut of Your Choice',
      'Beard Style / Shaving for Men',
      'Facial Treatment',
      'Hair Treatment / Keratin Treatment Suited for You'
    ]
  },
  {
    id: 'pkg_deluxe',
    name: 'Deluxe Grooming Package',
    price: 699,
    features: [
      'Premium Hair Cut & Styling',
      'Royal Hot Towel Shave',
      'Microdermabrasion Skin Treatment',
      'Brazilian Blowdry or Premium Color Dye'
    ]
  },
  {
    id: 'pkg_wedding',
    name: 'Wedding Styling Package',
    price: 799,
    features: [
      'Complete Hair & Beard Glow Package',
      'Deep Cleansing Hydrating Facial',
      'Premium Scalp Keratin Hydration',
      'Champagne / Complimentary Drink Service'
    ]
  }
];

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<string>('hair-cut');
  const dispatch = useDispatch();

  const handleAddToCart = (item: PriceItem) => {
    // Map standard pricing item to catalog product structure
    dispatch(addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: '/img/placeholder-service.jpg', // service placeholder image
      quantity: 1
    }));
    toast.success(`${item.name} added to your styling cart!`);
  };

  const handleAddPackageToCart = (pkg: typeof PACKAGES[0]) => {
    dispatch(addToCart({
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      image: '/img/placeholder-service.jpg',
      quantity: 1
    }));
    toast.success(`${pkg.name} added to your styling cart!`);
  };

  return (
    <div className="w-full pb-24 text-white">
      <PageHeading title="Pricing Plan" breadcrumbs={[{ label: 'Pricing', href: '/pricing' }]} />

      {/* Main Pricing Section */}
      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-16 md:mt-24">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary font-bold uppercase tracking-wider text-xs block mb-3 font-manrope">Styling Menu</span>
          <h2 className="font-cormorant text-4xl md:text-5xl font-bold mb-4">Our Premium Service Prices</h2>
          <p className="text-white/60 font-manrope text-sm leading-relaxed">
            Choose from our custom hair styling, precision beard trims, organic facials, and premium hair repair packages.
          </p>
        </div>

        {/* Categories Tabs Selector */}
        <div className="border-b border-white/10 mb-12 overflow-x-auto whitespace-nowrap flex justify-center">
          <div className="flex gap-4 md:gap-8 pb-3">
            {[
              { id: 'hair-cut', label: 'Hair Cut' },
              { id: 'shaving', label: 'Shaving' },
              { id: 'hair-dye', label: 'Hair Dye' },
              { id: 'facial', label: 'Facial' },
              { id: 'keratin', label: 'Keratin Treatment' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-manrope text-sm md:text-base font-semibold tracking-wide px-4 py-2 border-b-2 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content Grid list */}
        <div className="grid lg:grid-cols-2 gap-x-12 gap-y-8 min-h-[300px]">
          {PRICING_DATA[activeTab]?.map(item => (
            <div 
              key={item.id} 
              className="flex items-center gap-4 md:gap-6 group py-4 border-b border-white/5 hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex-1 space-y-1.5">
                <h4 className="font-cormorant text-xl md:text-2xl font-bold group-hover:text-primary transition-colors">
                  {item.name}
                </h4>
                <p className="text-white/60 font-manrope text-xs md:text-sm">
                  {item.description}
                </p>
              </div>
              
              <div className="hidden md:block flex-1 border-t border-primary/20 border-dashed mx-2"></div>
              
              <div className="flex items-center gap-4">
                <span className="font-cormorant text-2xl md:text-3xl font-semibold text-primary">
                  ${item.price}
                </span>
                <Button
                  onClick={() => handleAddToCart(item)}
                  className="w-10 h-10 bg-primary/10 hover:bg-primary border border-primary/20 hover:border-primary text-primary hover:text-black rounded-xl p-0 transition-all duration-300"
                  title="Add to Booking"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Styled Packages Section */}
      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-24 md:mt-32">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-bold uppercase tracking-wider text-xs block mb-3 font-manrope">Bundled Services</span>
          <h2 className="font-cormorant text-4xl md:text-5xl font-bold mb-4">Our Special Packages</h2>
          <p className="text-white/60 font-manrope text-sm leading-relaxed">
            Save up to 25% with our curated premium style packages perfect for everyday grooming or wedding styles.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PACKAGES.map(pkg => (
            <div 
              key={pkg.id} 
              className="bg-secondary/20 border border-primary/10 hover:border-primary/30 rounded-3xl p-8 flex flex-col justify-between space-y-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 group"
            >
              {/* Card top banner/decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none group-hover:bg-primary/10 transition-colors"></div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-cormorant text-2xl md:text-3xl font-bold leading-tight group-hover:text-primary transition-colors">
                    {pkg.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="font-cormorant text-4xl md:text-5xl font-extrabold text-primary">${pkg.price}</span>
                    <span className="text-white/50 text-xs font-manrope">/ session</span>
                  </div>
                </div>

                <hr className="border-white/10" />

                <ul className="space-y-4 font-manrope text-sm text-white/80">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-primary/15 rounded-full flex items-center justify-center border border-primary/20 mt-0.5 shrink-0">
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={() => handleAddPackageToCart(pkg)}
                className="btn-primary w-full h-12 rounded-xl font-bold font-manrope tracking-wider text-sm transition-transform active:scale-[0.98]"
              >
                Choose Plan
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Booking CTA banner */}
      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-24 md:mt-32">
        <div className="bg-secondary/40 border border-primary/15 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none"></div>
          
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <h3 className="font-cormorant text-3xl md:text-4xl font-bold">Ready To Book Your Style?</h3>
            <p className="text-white/60 font-manrope text-sm md:text-base">
              Secure your slot in seconds with our online styling scheduler. Choose your stylist, date, and preferred time.
            </p>
          </div>

          <Link href="/appointment">
            <Button className="btn-primary h-14 px-8 rounded-xl font-bold font-manrope flex items-center gap-2 shadow-lg shadow-primary/10 whitespace-nowrap">
              Make Appointment <Calendar className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
