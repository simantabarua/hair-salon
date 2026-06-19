'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Award, Users, MapPin, Sparkles, Star, ChevronLeft, ChevronRight, Play, Quote } from 'lucide-react';
import PageHeading from '@/components/layout/PageHeading';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const STATS = [
  { value: '15+', label: 'Years Experience', icon: Award },
  { value: '137k+', label: 'Happy Clients', icon: Users },
  { value: '4', label: 'Salon Branches', icon: MapPin },
  { value: '12+', label: 'Elite Stylists', icon: Sparkles }
];

const TESTIMONIALS = [
  {
    id: 1,
    text: "Highly recommend this hair salon! The stylists are absolute experts in their craft, and the salon has a wonderfully welcoming and luxurious atmosphere. I'm always impressed with the level of service and the incredible transformations they achieve.",
    author: "Sarah Jenkins",
    role: "Regular Client Since 2021",
    rating: 5,
    image: "/img/Testimonials/unsplash_LaK153ghdig.png"
  },
  {
    id: 2,
    text: "The premium shaving and grooming package here is top-tier. They pay attention to every detail, from the warm towels to the customized styling products. It's not just a haircut, it's a full self-care ritual. Will definitely be returning!",
    author: "David Miller",
    role: "Executive Grooming Client",
    rating: 5,
    image: "/img/Team/team-3.jpg"
  },
  {
    id: 3,
    text: "Sophia transformed my damaged hair completely using their organic therapy. The customer care is stellar, and they explain how to maintain the style at home. Highly professional staff and beautiful premium interiors.",
    author: "Elena Rostova",
    role: "Skin Care Enthusiast",
    rating: 5,
    image: "/img/Team/team-4.jpg"
  }
];

const BRANDS = [
  { name: "L'Oreal", logo: '/img/About Us Page/loreal.png' },
  { name: "Dove", logo: '/img/About Us Page/Dove svg.png' },
  { name: "Head & Shoulders", logo: '/img/About Us Page/Head & Shoulders svg.png' },
  { name: "Organic Tree", logo: '/img/About Us Page/tree.png' }
];

export default function AboutPage() {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  // Auto-scroll testimonials
  useEffect(() => {
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full pb-20 text-white">
      {/* Page Heading */}
      <PageHeading title="About Us" breadcrumbs={[{ label: 'About', href: '/about' }]} />

      {/* Section: Our Story */}
      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-16 md:mt-24">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-primary/20 aspect-video lg:aspect-square group">
            <Image
              src="/img/About Us Page/adam-winger-VjRpkGtS55w-unsplash 2.png"
              alt="Our Story Salon"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
              sizes="(max-w-7xl) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent opacity-65"></div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-primary font-bold uppercase tracking-wider text-xs font-manrope">Established 2012</span>
            <h2 className="font-cormorant text-4xl md:text-5xl font-bold text-white">Our Story &amp; Philosophy</h2>
            
            <div className="font-manrope text-white/70 space-y-4 text-sm leading-relaxed">
              <p className="text-white text-base font-semibold">
                We believe that hair styling is an art form, and every individual is a unique canvas.
              </p>
              <p>
                Founded in 2012, our salon started with a simple vision: to combine traditional grooming techniques with contemporary fashion, creating a bespoke experience for every client who walks through our doors.
              </p>
              <p>
                Over the years, we have grown into a premier beauty and wellness sanctuary. Our award-winning team of master stylists and hair therapists continuously train in the latest global trends, using only organic, sustainable, and premium hair care products that nurture your scalp and protect the planet.
              </p>
              <p>
                From classic scissor cuts and customized coloring to luxury skin therapies, we guarantee that you will leave our salon feeling rejuvenated, confident, and glowing with style.
              </p>
            </div>
            
            <div className="pt-4">
              <Link href="/appointment">
                <Button className="btn-primary h-12 px-6 rounded-xl font-bold flex items-center gap-2">
                  Book Appointment Now
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Stats Banner Grid */}
      <section className="bg-primary text-secondary py-12 mt-20 md:mt-28">
        <div className="max-w-8xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {STATS.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <div key={idx} className="space-y-2 flex flex-col items-center justify-center">
                  <IconComp className="w-8 h-8 text-secondary/70 mb-1" />
                  <h3 className="font-cormorant text-4xl md:text-5xl font-bold text-secondary">
                    {stat.value}
                  </h3>
                  <p className="font-manrope text-xs md:text-sm font-bold uppercase tracking-wider text-secondary/80">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section: Our Goals */}
      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-20 md:mt-28">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 lg:order-2 relative rounded-2xl overflow-hidden border border-primary/20 aspect-video lg:aspect-square group">
            <Image
              src="/img/About Us Page/image 50.png"
              alt="Our Goals Styling"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-w-7xl) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent opacity-65"></div>
          </div>

          <div className="lg:col-span-6 space-y-6 lg:order-1">
            <span className="text-primary font-bold uppercase tracking-wider text-xs font-manrope">Client First Focus</span>
            <h2 className="font-cormorant text-4xl md:text-5xl font-bold text-white">Our Vision &amp; Goals</h2>
            
            <div className="font-manrope text-white/70 space-y-4 text-sm leading-relaxed">
              <p className="text-white text-base font-semibold">
                To define the future of luxury styling, skin nourishment, and client satisfaction.
              </p>
              <p>
                We strive to maintain an environment where creativity thrives and premium standards are consistently delivered. Our primary goal is to ensure each client feels personally cared for, listening closely to their ideas and translating them into customized styles.
              </p>
              <p>
                We are committed to using eco-friendly formulas, avoiding harsh chemicals, and championing sustainable beauty. By sourcing organic creams, natural dyes, and recyclable styling accessories, we aim to make high fashion responsible.
              </p>
            </div>
            
            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="bg-secondary/40 border border-primary/10 p-4 rounded-xl space-y-1">
                <h5 className="font-cormorant text-lg font-bold text-primary">100% Organic Products</h5>
                <p className="text-xs text-white/50">Cruelty-free, vegan &amp; paraben-free styling agents.</p>
              </div>
              <div className="bg-secondary/40 border border-primary/10 p-4 rounded-xl space-y-1">
                <h5 className="font-cormorant text-lg font-bold text-primary">Master Craftsmen</h5>
                <p className="text-xs text-white/50">Licensed professionals with decade plus expertise.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Video Banner Mockup */}
      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-24 md:mt-32">
        <div className="relative rounded-3xl overflow-hidden border border-primary/20 aspect-video flex items-center justify-center group shadow-2xl">
          <Image
            src="/img/About Us Page/video.png"
            alt="Salon Experience Video Backdrop"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-1000"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

          <div className="relative z-10 text-center space-y-4 px-6 max-w-2xl">
            <button
              onClick={() => toast.info('Launching salon introduction video player...')}
              className="w-20 h-20 bg-primary hover:bg-primary/90 text-secondary rounded-full flex items-center justify-center mx-auto shadow-lg shadow-primary/25 transition-transform hover:scale-110 active:scale-95"
            >
              <Play className="w-8 h-8 fill-secondary translate-x-0.5" />
            </button>
            <h3 className="font-cormorant text-3xl md:text-4xl font-bold text-white">Experience The Luxury</h3>
            <p className="text-white/70 font-manrope text-sm md:text-base leading-relaxed">
              Take a virtual tour of our flagship studio, meet our stylists, and watch our custom hair care procedures in action.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Testimonials Slider */}
      <section className="max-w-6xl mx-auto px-4 mt-24 md:mt-32">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary font-bold uppercase tracking-wider text-xs block mb-3 font-manrope">Client Reviews</span>
          <h2 className="font-cormorant text-4xl md:text-5xl font-bold mb-4">What Our Clients Say</h2>
        </div>

        <div className="relative bg-secondary/35 border border-primary/15 rounded-3xl p-8 md:p-14 text-center max-w-4xl mx-auto shadow-xl">
          <Quote className="w-12 h-12 text-primary/20 mx-auto mb-6" />

          {/* Active Testimonial Content */}
          <div className="space-y-6 min-h-[160px] flex flex-col justify-center">
            <h4 className="font-cormorant text-2xl md:text-3xl italic leading-relaxed text-white">
              &quot;{TESTIMONIALS[activeSlide].text}&quot;
            </h4>

            <div className="flex justify-center gap-1">
              {Array.from({ length: TESTIMONIALS[activeSlide].rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-primary fill-primary" />
              ))}
            </div>

            <div className="flex items-center justify-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-primary/20">
                <Image
                  src={TESTIMONIALS[activeSlide].image}
                  alt={TESTIMONIALS[activeSlide].author}
                  fill
                  className="object-cover object-top"
                  sizes="48px"
                />
              </div>
              <div className="text-left">
                <p className="font-bold text-white font-manrope text-sm">{TESTIMONIALS[activeSlide].author}</p>
                <p className="text-xs text-white/50 font-manrope">{TESTIMONIALS[activeSlide].role}</p>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={prevSlide}
              className="p-2 bg-secondary border border-primary/10 hover:border-primary text-white rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-primary" />
            </button>

            <div className="flex gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === activeSlide ? 'bg-primary w-6' : 'bg-primary/20'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-2 bg-secondary border border-primary/10 hover:border-primary text-white rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
      </section>

      {/* Brand Sponsors */}
      <section className="max-w-6xl mx-auto px-4 mt-20 md:mt-28 py-10 border-t border-primary/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center opacity-60 hover:opacity-85 transition-opacity">
          {BRANDS.map((brand, idx) => (
            <div key={idx} className="relative h-12 md:h-16 w-full flex items-center justify-center">
              <img
                src={brand.logo}
                alt={brand.name}
                className="max-h-full max-w-[160px] object-contain filter brightness-0 invert"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
