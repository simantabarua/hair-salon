import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Github, Dribbble } from '@/components/ui/SocialIcons';

export default function Footer() {
  return (
    <footer className="bg-secondary/40 border-t border-primary/10">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-8 py-12 md:py-16 text-white/80 font-manrope">
        <div className="xl:grid xl:grid-cols-3 xl:gap-12">
          {/* Brand/Description */}
          <div className="space-y-6">
            <h2 className="text-3xl font-cormorant font-semibold tracking-wider text-white">
              Hair <span className="text-primary">Salon</span>
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-white/60">
              Your destination for premium hair care and beauty treatments. We combine expert craftsmanship with the finest organic products to help you look and feel your very best — every single visit.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="text-primary hover:text-primary/70 transition-colors">
                <Facebook className="w-6 h-6" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-primary hover:text-primary/70 transition-colors">
                <Instagram className="w-6 h-6" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-primary hover:text-primary/70 transition-colors">
                <Twitter className="w-6 h-6" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-primary hover:text-primary/70 transition-colors">
                <Github className="w-6 h-6" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-primary hover:text-primary/70 transition-colors">
                <Dribbble className="w-6 h-6" />
                <span className="sr-only">Dribbble</span>
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="mt-12 xl:mt-0 xl:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-cormorant font-semibold leading-6 text-white tracking-wider">
                Services
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link href="/services" className="text-sm text-white/60 hover:text-primary transition-colors">Hair Cut</Link>
                </li>
                <li>
                  <Link href="/services" className="text-sm text-white/60 hover:text-primary transition-colors">Hair Dye</Link>
                </li>
                <li>
                  <Link href="/services" className="text-sm text-white/60 hover:text-primary transition-colors">Shaving</Link>
                </li>
                <li>
                  <Link href="/services" className="text-sm text-white/60 hover:text-primary transition-colors">Massage</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-cormorant font-semibold leading-6 text-white tracking-wider">
                Support
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link href="/pricing" className="text-sm text-white/60 hover:text-primary transition-colors">Pricing</Link>
                </li>
                <li>
                  <Link href="/faq" className="text-sm text-white/60 hover:text-primary transition-colors">FAQ</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-white/60 hover:text-primary transition-colors">Booking Guides</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-white/60 hover:text-primary transition-colors">Help Center</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-cormorant font-semibold leading-6 text-white tracking-wider">
                Company
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link href="/about" className="text-sm text-white/60 hover:text-primary transition-colors">About Us</Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-white/60 hover:text-primary transition-colors">Blog</Link>
                </li>
                <li>
                  <Link href="/team" className="text-sm text-white/60 hover:text-primary transition-colors">Meet Stylists</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-white/60 hover:text-primary transition-colors">Careers</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-cormorant font-semibold leading-6 text-white tracking-wider">
                Legal
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link href="#" className="text-sm text-white/60 hover:text-primary transition-colors">Claim</Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-white/60 hover:text-primary transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-white/60 hover:text-primary transition-colors">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary/10 flex flex-col md:flex-row items-center justify-between text-xs text-white/40">
          <p>
            Copyright © {new Date().getFullYear()} Hair Salon. All Rights Reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
