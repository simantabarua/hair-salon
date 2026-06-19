'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageHeading from '@/components/layout/PageHeading';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { services } from '@/data/salonData';

const packages = [
  {
    name: 'Grooming Package',
    price: 499,
    features: [
      'Hair Cut of Your Choice',
      'Beard Style / Shaving for Men',
      'Facial Treatment',
      'Hair Treatment / Keratin Treatment Suited for You',
    ],
  },
  {
    name: 'Luxury Grooming Package',
    price: 699,
    features: [
      'Premium Hair Cut & Style',
      'Beard Shave with Hot Towel Service',
      'Hydrating Facial & Massage',
      'Deep Conditioning / Custom Hair Mask',
      'Premium Grooming Product Travel Set',
    ],
  },
  {
    name: 'Wedding Day Package',
    price: 799,
    features: [
      'Complete Hair Styling & Design',
      'Detailing Beard Sculpt / Clean Shave',
      'Skin Prep, Scrub & Refining Treatment',
      'Scalp Therapy with Essential Oils',
      'Champagne / Beverage Service Included',
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="relative w-full pb-20 md:pb-32">
      {/* Page Banner */}
      <PageHeading
        title="Services"
        breadcrumbs={[{ label: 'Services', href: '/services' }]}
      />

      {/* Services Grid */}
      <section className="py-20 max-w-8xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-primary font-cormorant text-xl tracking-wider font-semibold">Our Menu</span>
          <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-white tracking-wide">Professional Hair Services</h2>
          <p className="text-white/60 font-manrope text-sm md:text-base">
            We provide a wide array of premium styling, cutting, coloring, and hair treatment options tailored specifically to your visual style.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative flex flex-col items-center text-center p-8 md:p-10 rounded-2xl bg-secondary/40 border border-primary/20 hover:border-primary hover:bg-secondary/70 transition-all duration-300 shadow-xl"
            >
              <div className="relative w-20 h-20 mb-6 flex items-center justify-center bg-primary/5 rounded-2xl group-hover:bg-primary/10 transition-colors border border-primary/10">
                <Image
                  className="object-contain p-2"
                  src={service.icon}
                  alt={service.name}
                  fill
                  sizes="80px"
                />
              </div>
              <h4 className="font-cormorant text-2xl md:text-3xl font-semibold text-white mb-3 group-hover:text-primary transition-colors">
                {service.name}
              </h4>
              <p className="text-white/60 text-sm font-manrope leading-relaxed mb-6">
                {service.description}
              </p>
              <div className="mt-auto w-full">
              <Link
                href="/appointment"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "w-full bg-primary text-black hover:bg-primary/80 font-semibold py-5 rounded-xl transition-all duration-300 h-auto text-center"
                )}
              >
                Book now
              </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="py-20 bg-secondary/30 border-y border-primary/5">
        <div className="max-w-8xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-primary font-cormorant text-xl tracking-wider font-semibold">Grooming Packages</span>
            <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-white tracking-wide">Featured Packages</h2>
            <p className="text-white/60 font-manrope text-sm md:text-base">
              Bundle your favorite styling services into our master-tier packages for full body rejuvenation.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 justify-items-center">
            {packages.map((pkg, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-8 w-full max-w-md px-6 md:px-8 py-12 rounded-2xl bg-secondary border border-primary/30 hover:border-primary transition-colors shadow-2xl"
              >
                <div className="text-center space-y-3 font-cormorant">
                  <h3 className="text-3xl font-semibold text-white">{pkg.name}</h3>
                  <div className="text-4xl md:text-5xl font-bold text-primary">${pkg.price}</div>
                </div>

                <ul className="space-y-4 flex-grow py-4">
                  {pkg.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start gap-3">
                      <div className="w-5 h-5 mt-0.5 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-white/80 font-manrope text-sm md:text-base leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/appointment"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "w-full bg-primary text-black hover:bg-primary/80 font-semibold py-5 rounded-xl transition-all duration-300 h-auto text-center"
                  )}
                >
                  Choose Plan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Booking Call to Action */}
      <section className="pt-20 max-w-4xl mx-auto px-4 md:px-8 text-center space-y-6">
        <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-white leading-tight">
          Ready to Elevate Your Look?
        </h2>
        <p className="text-white/65 font-manrope text-sm md:text-base max-w-xl mx-auto">
          Contact our reception desk or use our automated calendar portal to schedule a session with our award-winning barbers.
        </p>
        <div className="pt-4">
          <Link
            href="/appointment"
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-primary text-black hover:bg-primary/80 font-semibold px-10 py-6 rounded-xl transition-all duration-300 h-auto text-center inline-block"
            )}
          >
            Schedule Appointment
          </Link>
        </div>
      </section>
    </div>
  );
}
