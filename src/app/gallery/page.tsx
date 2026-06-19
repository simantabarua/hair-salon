'use client';

import React, { useState } from 'react';
import PageHeading from '@/components/layout/PageHeading';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Scissors } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'cuts' | 'color' | 'bridal' | 'therapy';
  image: string;
  stylist: string;
  description: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Textured Modern Crop',
    category: 'cuts',
    image: '/img/Team Members Images/team-1.png',
    stylist: 'Tranter Jaskulski',
    description: 'A textured, low-maintenance modern crop with clean tapered sides and natural movement.',
  },
  {
    id: 'g-2',
    title: 'Sun-Kissed Golden Balayage',
    category: 'color',
    image: '/img/Team Members Images/team-2.png',
    stylist: 'Sarah Jenkins',
    description: 'Soft, seamless hand-painted golden highlights blending beautifully with warm chestnut undertones.',
  },
  {
    id: 'g-3',
    title: 'Classic Pompadour Fade',
    category: 'cuts',
    image: '/img/Team Members Images/team-3.png',
    stylist: 'David Miller',
    description: 'A sharp skin fade blended into a high-volume classic pompadour, styled with strong hold pomade.',
  },
  {
    id: 'g-4',
    title: 'Luxury Editorial Updo',
    category: 'bridal',
    image: '/img/Team Members Images/team-4.png',
    stylist: 'Sophia Loren',
    description: 'An elegant, textured updo designed for brides and high-profile events, adorned with custom hairpins.',
  },
  {
    id: 'g-5',
    title: 'Keratin Nourishing Therapy',
    category: 'therapy',
    image: '/img/Products Images/product-1.png',
    stylist: 'Emma Watson',
    description: 'Deep hair smoothing and scalp restoration therapy that eliminates frizz and enhances shine.',
  },
  {
    id: 'g-6',
    title: 'Platinum Blonde Sculpt',
    category: 'color',
    image: '/img/Products Images/product-2.png',
    stylist: 'Sarah Jenkins',
    description: 'A bold, premium platinum coloring treatment paired with an edgy structured undercut.',
  },
  {
    id: 'g-7',
    title: 'Executive Razor Shave',
    category: 'cuts',
    image: '/img/Products Images/product-3.png',
    stylist: 'Tranter Jaskulski',
    description: 'Premium hot towel preparation followed by a precision straight razor shave and custom aftershave balm.',
  },
  {
    id: 'g-8',
    title: 'Romantic Bridal Waves',
    category: 'bridal',
    image: '/img/Products Images/product-4.png',
    stylist: 'Sophia Loren',
    description: 'Cascading, high-volume romantic waves designed to last all day and night.',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Styles' },
  { id: 'cuts', label: 'Precision Cuts' },
  { id: 'color', label: 'Coloring & Balayage' },
  { id: 'bridal', label: 'Bridal & Updos' },
  { id: 'therapy', label: 'Hair Therapy' },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = activeCategory === 'all' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="w-full pb-24 text-white font-manrope">
      {/* Page Heading */}
      <PageHeading title="Style Gallery" breadcrumbs={[{ label: 'Gallery', href: '/gallery' }]} />

      {/* Intro and Filters */}
      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-16 md:mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary font-bold uppercase tracking-wider text-xs block mb-3">Our Lookbook</span>
          <h2 className="font-cormorant text-4xl md:text-5xl font-bold mb-4">Inspiration For Your Next Look</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Browse through our portfolio of transformations and creative styling. Filter by category and find the style that matches your character.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-primary text-black'
                  : 'bg-secondary border border-primary/20 text-white hover:border-primary/50'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="group bg-secondary/35 border border-primary/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 shadow-lg flex flex-col h-full"
            >
              {/* Image Container with Hover zoom and overlay */}
              <div className="relative h-64 overflow-hidden bg-muted">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-w-640px) 100vw, (max-w-1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <span className="bg-primary/20 p-3 rounded-full border border-primary/30 text-primary">
                    <Scissors className="w-5 h-5" />
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] text-primary uppercase font-bold tracking-widest bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                    {item.category === 'cuts' && 'Precision Cut'}
                    {item.category === 'color' && 'Coloring'}
                    {item.category === 'bridal' && 'Bridal Updo'}
                    {item.category === 'therapy' && 'Scalp Therapy'}
                  </span>
                  <span className="text-xs text-white/40 italic">by {item.stylist}</span>
                </div>

                <h3 className="font-cormorant text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-6 flex-grow">
                  {item.description}
                </p>

                {/* CTA */}
                <div className="mt-auto pt-4 border-t border-white/5">
                  <Link href="/appointment" passHref className="w-full">
                    <Button className="w-full bg-secondary border border-primary/20 group-hover:bg-primary group-hover:text-black hover:border-transparent text-xs h-10 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                      <Calendar className="w-3.5 h-3.5" /> Book This Look
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
