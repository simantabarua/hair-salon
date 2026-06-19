'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import PageHeading from '@/components/layout/PageHeading';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Twitter } from '@/components/ui/SocialIcons';
import { Calendar, Award, Sparkles, Clock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Stylist {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  specialties: string[];
  achievements: string[];
  schedule: string;
  services: { name: string; price: string; duration: string }[];
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
    bio: 'Over 15 years of classic barbering experience, specializing in precision cuts, hot razor shaves, and grooming consultation. Tranter founded Aurelia Premium Salon with the vision of offering high-end, tailored experiences that preserve traditional techniques while embracing modern style.',
    specialties: ['Traditional Hot Towel Shave', 'Precision Scissor Cuts', 'Beard Design', 'Scalp Care Consultation'],
    achievements: ['Voted Barber of the Year 2024 (Metro)', 'Featured in Modern Grooming Magazine', 'Founder of Aurelia Masterclass Academy'],
    schedule: 'Mon - Fri (8:00 AM - 5:00 PM)',
    services: [
      { name: 'Royal Hot Razor Shave & Massage', price: '$55', duration: '40 min' },
      { name: 'Founder Precision Haircut', price: '$75', duration: '45 min' },
      { name: 'Beard Sculpting & Nourishing Oil', price: '$40', duration: '30 min' },
      { name: 'Signature Scalp Therapy & Wash', price: '$35', duration: '20 min' },
    ],
    socials: { facebook: '#', instagram: '#', twitter: '#' }
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    role: 'Senior Hair Colorist',
    image: '/img/Team Members Images/team-2.png',
    bio: 'Certified balayage expert passionate about organic styling products and personalized creative tones. Sarah has worked with celebrity clients and fashion shows, helping clients discover colors that perfectly match their skin tone and style.',
    specialties: ['Creative Color Painting', 'Signature French Balayage', 'Organic Hair Glossing', 'Color Correction'],
    achievements: ['L\'Oréal Color Specialist Certified', 'Mainstage Artist at National Hair Expo 2025', 'Organic Dye Educator'],
    schedule: 'Tue - Sat (10:00 AM - 7:00 PM)',
    services: [
      { name: 'Full French Balayage & Blowout', price: '$195', duration: '120 min' },
      { name: 'Creative Ombre / Sombre Dyeing', price: '$175', duration: '90 min' },
      { name: 'Full Head Organic Tint', price: '$120', duration: '60 min' },
      { name: 'Advanced Color Correction Treatment', price: '$220', duration: '150 min' },
    ],
    socials: { facebook: '#', instagram: '#', twitter: '#' }
  },
  {
    id: '3',
    name: 'David Miller',
    role: 'Stylist & Grooming Specialist',
    image: '/img/Team Members Images/team-3.png',
    bio: 'Specialist in modern fades, texturizing treatments, and styling advice for thick/coarse hair. David stays ahead of trends, bringing high-street and urban inspirations directly to your hair layout.',
    specialties: ['Urban Taper Fades', 'Modern Pompadours', 'Textured Crops', 'Volumizing Blowouts'],
    achievements: ['Winner of Styling Award 2024', 'Guest Editor at Hair Trends Monthly', 'Certified Keratin Stylist'],
    schedule: 'Wed - Sun (9:00 AM - 6:00 PM)',
    services: [
      { name: 'High-Street Skin Fade & Wash', price: '$50', duration: '30 min' },
      { name: 'Modern Pompadour Scissor Styling', price: '$65', duration: '40 min' },
      { name: 'Texturizing Keratin Blowout', price: '$85', duration: '50 min' },
      { name: 'Grooming Master Combo Package', price: '$90', duration: '60 min' },
    ],
    socials: { facebook: '#', instagram: '#', twitter: '#' }
  },
  {
    id: '4',
    name: 'Emma Watson',
    role: 'Keratin & Scalp Therapist',
    image: '/img/Team Members Images/team-4.png',
    bio: 'Dedicated to long-lasting hair restoration, keratin treatments, and relaxing massage therapies. Emma believes that beautiful hair starts from a healthy scalp, focusing on organic nourishing treatments.',
    specialties: ['Keratin Restructuring Therapy', 'Organic Scalp Hydration', 'Anti-Frizz Silk Treatment', 'Stress-Relief Head Massages'],
    achievements: ['Holistic Scalp Therapist Diploma', 'Developed In-House Nourish Mask Program', '10+ Years Styling & Therapy Experience'],
    schedule: 'Mon - Thu (9:00 AM - 6:00 PM)',
    services: [
      { name: 'Premium Keratin Restructuring', price: '$250', duration: '150 min' },
      { name: 'Organic Dermal Scalp Wash & Scrub', price: '$95', duration: '60 min' },
      { name: 'Anti-Frizz Silk Smoothing Express', price: '$140', duration: '90 min' },
      { name: 'Stress-Relief Aromatherapy Massage', price: '$60', duration: '30 min' },
    ],
    socials: { facebook: '#', instagram: '#', twitter: '#' }
  },
  {
    id: '5',
    name: 'Michael Chang',
    role: 'Senior Hair Sculptor',
    image: '/img/Team Members Images/team-1.png',
    bio: 'Passionate about structural styles, undercuts, and helping clients define their custom look. Michael utilizes geometric precision to create hair designs that adapt to face shape and natural hair flow.',
    specialties: ['Geometric Cuts & Undercuts', 'Asymmetric Bob Styling', 'Avant-Garde Designs', 'Layering Techniques'],
    achievements: ['Graduate of Sassoon Academy London', 'Creative Director for Autumn Runway 2025', 'Award for Avant-Garde Styling'],
    schedule: 'Fri - Tue (10:00 AM - 7:00 PM)',
    services: [
      { name: 'Precision Geometric Cut & Styling', price: '$85', duration: '50 min' },
      { name: 'Asymmetric Bob & Framing Sculpt', price: '$95', duration: '60 min' },
      { name: 'Modern Runway Wash & Blowout', price: '$70', duration: '40 min' },
      { name: 'Custom Layering & Face Frame Package', price: '$110', duration: '75 min' },
    ],
    socials: { facebook: '#', instagram: '#', twitter: '#' }
  },
  {
    id: '6',
    name: 'Sophia Loren',
    role: 'Wedding & Event Stylist',
    image: '/img/Team Members Images/team-4.png',
    bio: 'Sophia is our premium wedding and event package expert. She creates jaw-dropping updos, braids, and elegant classic styling that stays immaculate throughout your special celebrations.',
    specialties: ['Bridal Updos & Braiding', 'Classic Hollywood Waves', 'High-Profile Event Styling', 'Luxury Hair Extensions'],
    achievements: ['Leading Bridal Stylist (Vogue Brides)', 'Coordinated Styling for 500+ Weddings', 'Master Extension Certified'],
    schedule: 'Thu - Sun (8:00 AM - 6:00 PM)',
    services: [
      { name: 'Luxury Bridal Trial & Consultation', price: '$120', duration: '60 min' },
      { name: 'Wedding Day Signature Updo', price: '$220', duration: '90 min' },
      { name: 'Hollywood Glamour Waves styling', price: '$150', duration: '75 min' },
      { name: 'Premium Extension Fitting & Blend', price: '$300', duration: '120 min' },
    ],
    socials: { facebook: '#', instagram: '#', twitter: '#' }
  }
];

export default function StylistDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const stylist = useMemo(() => {
    return STYLISTS.find(s => s.id === id);
  }, [id]);

  if (!stylist) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center text-white space-y-4 px-4 font-manrope">
        <h2 className="font-cormorant text-4xl md:text-6xl font-bold">Stylist Not Found</h2>
        <p className="text-white/60">The professional stylist you are looking for does not exist or has been reassigned.</p>
        <Link href="/team">
          <Button className="btn-primary flex items-center gap-2 mt-4">
            <ArrowLeft className="w-4 h-4" /> Back to Team
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full pb-24 text-white font-manrope">
      {/* Page Heading */}
      <PageHeading title={stylist.name} breadcrumbs={[{ label: 'Team', href: '/team' }, { label: stylist.name, href: `/team/${stylist.id}` }]} />

      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-12 md:mt-20">
        
        {/* Back Link */}
        <Link href="/team" className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wider uppercase text-primary hover:text-primary/80 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Creative Team
        </Link>

        {/* Profile Card & Info Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Image and Socials */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-primary/10 bg-secondary/30">
              <Image
                src={stylist.image}
                alt={stylist.name}
                fill
                sizes="(max-w-768px) 100vw, 40vw"
                className="object-cover object-top"
                priority
              />
            </div>

            {/* Social profiles & schedule card */}
            <div className="bg-secondary/30 border border-primary/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xl">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-white/40 block mb-1">Social Profiles</span>
                <div className="flex gap-3">
                  {stylist.socials.facebook && (
                    <a href={stylist.socials.facebook} className="w-8 h-8 bg-primary/15 hover:bg-primary border border-primary/20 text-primary hover:text-black rounded-full flex items-center justify-center transition-colors">
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {stylist.socials.instagram && (
                    <a href={stylist.socials.instagram} className="w-8 h-8 bg-primary/15 hover:bg-primary border border-primary/20 text-primary hover:text-black rounded-full flex items-center justify-center transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {stylist.socials.twitter && (
                    <a href={stylist.socials.twitter} className="w-8 h-8 bg-primary/15 hover:bg-primary border border-primary/20 text-primary hover:text-black rounded-full flex items-center justify-center transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              <div className="border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6">
                <span className="text-[10px] uppercase tracking-wider text-white/40 block mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-primary" /> Hours / Schedule
                </span>
                <span className="text-xs font-semibold text-white/80">{stylist.schedule}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Bio, Specialties, Service List */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Header Details */}
            <div>
              <span className="text-primary font-bold uppercase tracking-widest text-xs mb-2 block">{stylist.role}</span>
              <h2 className="font-cormorant text-4xl md:text-5xl font-bold tracking-wide">{stylist.name}</h2>
              <p className="text-white/70 text-sm md:text-base leading-relaxed mt-4">
                {stylist.bio}
              </p>
            </div>

            {/* Specialties & Achievements Grid */}
            <div className="grid sm:grid-cols-2 gap-8 border-t border-b border-primary/10 py-8">
              {/* Specialties */}
              <div>
                <h4 className="font-cormorant text-xl font-bold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Core Specialties
                </h4>
                <ul className="space-y-2">
                  {stylist.specialties.map((spec, idx) => (
                    <li key={idx} className="text-xs md:text-sm text-white/70 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Achievements */}
              <div>
                <h4 className="font-cormorant text-xl font-bold mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" /> Accomplishments
                </h4>
                <ul className="space-y-2">
                  {stylist.achievements.map((ach, idx) => (
                    <li key={idx} className="text-xs md:text-sm text-white/70 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      {ach}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Services Table */}
            <div>
              <h3 className="font-cormorant text-2xl md:text-3xl font-bold mb-6">Stylist Service Catalog</h3>
              <div className="bg-secondary/20 border border-primary/5 rounded-2xl overflow-hidden shadow-xl">
                {stylist.services.map((service, idx) => (
                  <div 
                    key={idx} 
                    className="flex justify-between items-center p-5 border-b border-white/5 last:border-b-0 hover:bg-primary/5 transition-colors"
                  >
                    <div>
                      <h4 className="font-semibold text-sm md:text-base text-white">{service.name}</h4>
                      <span className="text-[10px] text-white/40 uppercase font-semibold">{service.duration} Session</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-primary font-cormorant text-xl md:text-2xl font-bold">{service.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Booking call to action */}
            <div className="bg-gradient-to-br from-secondary/45 to-secondary/25 border border-primary/15 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
              <div>
                <h4 className="font-cormorant text-xl md:text-2xl font-bold mb-1">Ready for your transformation?</h4>
                <p className="text-xs text-white/50">Schedule your consultation or full styling session with {stylist.name} now.</p>
              </div>
              <Link href={`/appointment?stylist=${stylist.id}`}>
                <Button className="btn-primary h-12 px-6 rounded-xl font-bold font-manrope text-sm flex items-center gap-2 shadow-lg shadow-primary/10 whitespace-nowrap cursor-pointer">
                  Book with {stylist.name.split(' ')[0]} <Calendar className="w-4 h-4" />
                </Button>
              </Link>
            </div>

          </div>

        </div>

      </section>
    </div>
  );
}
