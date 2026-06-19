'use client';

import React from 'react';
import PageHeading from '@/components/layout/PageHeading';
import { Calendar } from 'lucide-react';
import { Facebook, Instagram, Twitter } from '@/components/ui/SocialIcons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

interface Stylist {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  socials: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

const STYLISTS: Stylist[] = [
  {
    id: '1',
    name: 'Tranter Jaskulski',
    role: 'Founder & Master Barber',
    image: '/img/Team Members Images/team-1.png',
    bio: 'Over 15 years of classic barbering experience, specializing in precision cuts and hot razor shaves.',
    socials: { facebook: '#', instagram: '#', twitter: '#' }
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    role: 'Senior Hair Colorist',
    image: '/img/Team Members Images/team-2.png',
    bio: 'Certified balayage expert passionate about organic styling products and personalized creative tones.',
    socials: { facebook: '#', instagram: '#', twitter: '#' }
  },
  {
    id: '3',
    name: 'David Miller',
    role: 'Stylist & Grooming Specialist',
    image: '/img/Team Members Images/team-3.png',
    bio: 'Specialist in modern fades, texturizing treatments, and styling advice for thick/coarse hair.',
    socials: { facebook: '#', instagram: '#', twitter: '#' }
  },
  {
    id: '4',
    name: 'Emma Watson',
    role: 'Keratin & Scalp Therapist',
    image: '/img/Team Members Images/team-4.png',
    bio: 'Dedicated to long-lasting hair restoration, keratin treatments, and relaxing massage therapies.',
    socials: { facebook: '#', instagram: '#', twitter: '#' }
  },
  {
    id: '5',
    name: 'Michael Chang',
    role: 'Senior Hair Sculptor',
    image: '/img/Team Members Images/team-1.png',
    bio: 'Passionate about structural styles, undercuts, and helping clients define their custom look.',
    socials: { facebook: '#', instagram: '#', twitter: '#' }
  },
  {
    id: '6',
    name: 'Sophia Loren',
    role: 'Wedding & Event Stylist',
    image: '/img/Team Members Images/team-4.png',
    bio: 'Experienced in high-profile bridal packages, editorial updos, and premium event styling.',
    socials: { facebook: '#', instagram: '#', twitter: '#' }
  }
];

export default function TeamPage() {
  return (
    <div className="w-full pb-24 text-white">
      {/* Page Heading */}
      <PageHeading title="Our Team" breadcrumbs={[{ label: 'Team', href: '/team' }]} />

      {/* Meet Team Section */}
      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-16 md:mt-24">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-bold uppercase tracking-wider text-xs block mb-3 font-manrope">Creative Team</span>
          <h2 className="font-cormorant text-4xl md:text-5xl font-bold mb-4">Meet Our Professional Stylists</h2>
          <p className="text-white/60 font-manrope text-sm leading-relaxed">
            Our award-winning stylists combine precision technique with luxury products to bring your hair goals to life.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STYLISTS.map(stylist => (
            <div key={stylist.id} className="group relative flex flex-col items-center">
              {/* Image Container with Hover Overlay */}
              <div className="relative w-full h-[350px] rounded-3xl overflow-hidden shadow-xl border border-white/5">
                <Image
                  src={stylist.image}
                  alt={stylist.name}
                  fill
                  sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Social Overlay on Hover */}
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 px-6 text-center">
                  <p className="text-white/80 font-manrope text-sm leading-relaxed mb-4 italic">
                    &ldquo;{stylist.bio}&rdquo;
                  </p>
                  
                  <Link href={`/team/${stylist.id}`} className="text-xs uppercase tracking-widest text-primary border border-primary/30 bg-primary/5 px-4 py-2 rounded-lg hover:bg-primary hover:text-black transition-all mb-2 font-semibold">
                    View Profile
                  </Link>

                  <div className="flex gap-4">
                    {stylist.socials.facebook && (
                      <a href={stylist.socials.facebook} className="w-10 h-10 bg-primary/20 hover:bg-primary border border-primary/20 text-primary hover:text-black rounded-full flex items-center justify-center transition-colors">
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                    {stylist.socials.instagram && (
                      <a href={stylist.socials.instagram} className="w-10 h-10 bg-primary/20 hover:bg-primary border border-primary/20 text-primary hover:text-black rounded-full flex items-center justify-center transition-colors">
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                    {stylist.socials.twitter && (
                      <a href={stylist.socials.twitter} className="w-10 h-10 bg-primary/20 hover:bg-primary border border-primary/20 text-primary hover:text-black rounded-full flex items-center justify-center transition-colors">
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Box overlapping Image slightly */}
              <Link href={`/team/${stylist.id}`} className="w-[85%] z-20 -mt-8">
                <div className="bg-secondary border border-primary/10 group-hover:border-primary/30 rounded-2xl p-6 text-center shadow-2xl transition-all duration-300 hover:border-primary/60">
                  <h4 className="font-cormorant text-2xl font-bold group-hover:text-primary transition-colors mb-1">
                    {stylist.name}
                  </h4>
                  <p className="text-primary font-manrope text-xs md:text-sm font-medium uppercase tracking-wider">
                    {stylist.role}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Booking Banner */}
      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-24 md:mt-32">
        <div className="bg-secondary/40 border border-primary/15 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none"></div>
          
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <h3 className="font-cormorant text-3xl md:text-4xl font-bold">Have a Favorite Stylist in Mind?</h3>
            <p className="text-white/60 font-manrope text-sm md:text-base">
              Book a session directly with any of our master stylists or hair therapists today.
            </p>
          </div>

          <Link href="/appointment">
            <Button className="btn-primary h-14 px-8 rounded-xl font-bold font-manrope flex items-center gap-2 shadow-lg shadow-primary/10 whitespace-nowrap">
              Schedule Now <Calendar className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
