'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ShoppingBag, Search, Menu, X, ChevronDown } from 'lucide-react';
import { RootState } from '@/store';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const cartTotalItems = useSelector((state: RootState) => state.cart.totalItems);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Shop', href: '/shop' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const pageLinks = [
    { label: 'Appointment', href: '/appointment' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Product Details', href: '/shop/beauty-case' }, // Hardcode a product ID for demo
    { label: 'Cart', href: '/cart' },
    { label: 'Team', href: '/team' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Blog', href: '/blog' },
    { label: 'Blog Details', href: '/blog/hair-care-tips' }, // Hardcode slug for demo
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 md:h-20 transition-all duration-300 ${
        isScrolled ? 'bg-secondary/95 backdrop-blur-md border-b border-primary/20 shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-8xl px-4 md:px-8 h-full mx-auto flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          {/* Mobile Menu trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-white hover:text-primary focus:ring-1 focus:ring-primary"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              }
            />
            <SheetContent side="left" className="bg-secondary border-r border-primary/20 text-white w-72 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-primary/10 pb-4 mb-6">
                  <h2 className="text-2xl font-semibold tracking-wider text-primary font-cormorant">Hair Salon</h2>
                </div>
                <ul className="flex flex-col gap-5 text-lg font-manrope">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`block transition-colors py-1 ${
                          isActive(link.href) ? 'text-primary font-semibold' : 'text-white/80 hover:text-primary'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li className="border-t border-primary/10 pt-4 mt-2">
                    <span className="text-xs tracking-widest text-primary/60 font-semibold block mb-3 uppercase">Pages</span>
                    <ul className="flex flex-col gap-3 pl-2 text-base">
                      {pageLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`block transition-colors ${
                              isActive(link.href) ? 'text-primary font-semibold' : 'text-white/60 hover:text-primary'
                            }`}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </div>
              <div className="border-t border-primary/10 pt-4">
                <Button className="w-full bg-primary text-black hover:bg-primary/80 font-bold" onClick={() => setIsOpen(false)}>
                  Book Appointment
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="text-2xl md:text-3xl font-cormorant tracking-widest text-white hover:text-primary transition-colors">
            Hair <span className="text-primary font-semibold">Salon</span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1">
          <ul className="navbar-nav">
            {navLinks.map((link) => (
              <li
                key={link.href}
                className={`nav-item ${isActive(link.href) ? 'active-nav' : ''}`}
              >
                <Link href={link.href} className="transition-colors duration-300">
                  {link.label}
                </Link>
              </li>
            ))}
            {/* Dropdown container */}
            <li
              className="relative inline-flex items-center text-sm font-semibold cursor-pointer py-2.5 px-1 text-white/80 hover:text-primary transition-colors duration-300"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className="flex items-center gap-1.5 focus:outline-none h-12">
                Pages
                <ChevronDown className={`w-4 h-4 transform transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown list */}
              <div
                className={`absolute left-0 top-full w-56 py-3 px-4 bg-secondary border border-primary/20 rounded-xl shadow-2xl transition-all duration-300 origin-top transform ${
                  isDropdownOpen
                    ? 'opacity-100 scale-y-100 translate-y-0 visible'
                    : 'opacity-0 scale-y-75 -translate-y-2 invisible'
                }`}
              >
                <ul className="flex flex-col gap-2.5 text-sm font-manrope">
                  {pageLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`block py-1 px-2 rounded-md hover:bg-primary/10 hover:text-primary transition-all ${
                          isActive(link.href) ? 'text-primary font-semibold bg-primary/5' : 'text-white/80'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>

        {/* Buttons (Cart, Search, Sign Up) */}
        <div className="flex items-center gap-3 md:gap-4">
          <Link
            href="/cart"
            className="relative flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-xl bg-secondary/80 border border-primary/30 text-white hover:bg-primary hover:text-black hover:border-primary transition-all duration-300"
          >
            <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
            {cartTotalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-md">
                {cartTotalItems}
              </span>
            )}
          </Link>

          <Link
            href="/appointment"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "hidden sm:flex border border-primary bg-transparent text-primary hover:bg-primary hover:text-black font-semibold text-xs md:text-sm px-4 md:px-6 py-2.5 rounded-xl transition-all duration-300 h-auto text-center items-center justify-center"
            )}
          >
            Book Slot
          </Link>

          <Link
            href="/contact"
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-primary text-black hover:bg-primary/80 font-semibold text-xs md:text-sm px-4 md:px-6 py-2.5 rounded-xl transition-all duration-300 h-auto text-center items-center justify-center"
            )}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
