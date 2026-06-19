'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ShoppingBag, Menu, ChevronDown, User2, LogOut, LogIn, UserPlus } from 'lucide-react';
import { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

// Primary nav items — visible in desktop bar
const PRIMARY_NAV = [
  { label: 'Home',     href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Shop',     href: '/shop' },
  { label: 'Blog',     href: '/blog' },
  { label: 'About',    href: '/about' },
  { label: 'Contact',  href: '/contact' },
];

// Secondary nav items — tucked into "More" dropdown
const MORE_NAV = [
  { label: 'Pricing',    href: '/pricing' },
  { label: 'FAQ',        href: '/faq' },
  { label: 'Our Team',   href: '/team' },
  { label: 'Appointment',href: '/appointment' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();

  const [isScrolled,    setIsScrolled]    = useState(false);
  const [isOpen,        setIsOpen]        = useState(false);
  const [isMoreOpen,    setIsMoreOpen]    = useState(false);
  const [isUserMenuOpen,setIsUserMenuOpen]= useState(false);
  const [isLoggedIn,    setIsLoggedIn]    = useState(false);
  const [userName,      setUserName]      = useState('');

  const moreRef    = useRef<HTMLDivElement>(null);
  const userMenuRef= useRef<HTMLDivElement>(null);

  const cartTotalItems = useSelector((state: RootState) => state.cart.totalItems);

  /* ── Helpers ── */
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const isMoreActive = MORE_NAV.some((l) => isActive(l.href));

  const syncAuth = () => {
    const stored = localStorage.getItem('salon_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { name?: string };
        setIsLoggedIn(true);
        setUserName(parsed.name ?? 'User');
      } catch {
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
      setUserName('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('salon_user');
    localStorage.removeItem('salon_remember');
    setIsLoggedIn(false);
    setUserName('');
    setIsUserMenuOpen(false);
    toast.success('You have been signed out.');
    router.push('/');
  };

  /* ── Effects ── */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Sync auth state asynchronously to avoid warning of setState inside useEffect
    Promise.resolve().then(() => {
      syncAuth();
    });
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node))
        setIsMoreOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Render ── */
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 md:h-[68px] transition-all duration-300 ${
        isScrolled
          ? 'bg-secondary/97 backdrop-blur-lg border-b border-primary/15 shadow-xl shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] px-4 md:px-6 h-full mx-auto flex items-center justify-between text-white gap-4">

        {/* ── Left: hamburger + logo ── */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Mobile hamburger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="xl:hidden text-white hover:text-primary"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation</span>
                </Button>
              }
            />
            <SheetContent side="left" className="bg-secondary border-r border-primary/20 text-white w-72 p-6 flex flex-col justify-between">
              <div>
                <div className="border-b border-primary/10 pb-4 mb-6">
                  <Link href="/" onClick={() => setIsOpen(false)} className="font-cormorant text-2xl tracking-widest text-primary font-semibold">
                    Hair Salon
                  </Link>
                </div>
                <ul className="flex flex-col gap-1 font-manrope text-base">
                  {[...PRIMARY_NAV, ...MORE_NAV].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all ${
                          isActive(link.href)
                            ? 'bg-primary/10 text-primary font-semibold border-l-2 border-primary'
                            : 'text-white/70 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-primary/10 pt-4 space-y-2">
                {isLoggedIn ? (
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg font-manrope text-sm text-red-400 hover:bg-red-500/5 transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/login" onClick={() => setIsOpen(false)}
                      className="w-full text-center border border-primary/40 text-primary py-2.5 rounded-xl font-manrope font-semibold text-sm hover:bg-primary/10 transition-all">
                      Login
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}
                      className="w-full text-center bg-primary text-black py-2.5 rounded-xl font-manrope font-bold text-sm hover:bg-primary/90 transition-all">
                      Register
                    </Link>
                  </div>
                )}
                <Link
                  href="/appointment"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-white/5 border border-white/10 text-white py-2.5 rounded-xl font-manrope font-semibold text-sm hover:border-primary/40 transition-all"
                >
                  Book Appointment
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link
            href="/"
            className="font-cormorant text-xl md:text-2xl tracking-widest text-white hover:text-primary transition-colors whitespace-nowrap"
          >
            Hair <span className="text-primary font-semibold">Salon</span>
          </Link>
        </div>

        {/* ── Center: Desktop nav ── */}
        <div className="hidden xl:flex items-center flex-1 justify-center">
          <ul className="flex items-center gap-0.5">
            {PRIMARY_NAV.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative inline-flex items-center px-3 py-2 rounded-lg font-manrope text-[13px] font-semibold transition-all duration-200 group ${
                    isActive(link.href)
                      ? 'text-primary'
                      : 'text-white/75 hover:text-white'
                  }`}
                >
                  {link.label}
                  {/* active underline */}
                  <span className={`absolute bottom-0.5 left-3 right-3 h-[1.5px] rounded-full bg-primary transition-all duration-300 ${
                    isActive(link.href) ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-40 group-hover:scale-x-100'
                  }`} />
                </Link>
              </li>
            ))}

            {/* More dropdown */}
            <li>
              <div className="relative" ref={moreRef}>
                <button
                  onClick={() => setIsMoreOpen((v) => !v)}
                  className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg font-manrope text-[13px] font-semibold transition-all duration-200 ${
                    isMoreActive ? 'text-primary' : 'text-white/75 hover:text-white'
                  }`}
                >
                  More
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className={`absolute left-0 top-full pt-2 transition-all duration-200 origin-top-left ${
                  isMoreOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible pointer-events-none'
                }`}>
                  <div className="bg-secondary border border-primary/20 rounded-xl shadow-2xl shadow-black/50 overflow-hidden w-44">
                    {MORE_NAV.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMoreOpen(false)}
                        className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-manrope font-medium transition-all ${
                          isActive(link.href)
                            ? 'bg-primary/10 text-primary border-l-2 border-primary'
                            : 'text-white/70 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        {/* ── Right: actions ── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white hover:border-primary hover:text-primary transition-all duration-300"
          >
            <ShoppingBag className="w-[18px] h-[18px]" />
            {cartTotalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow">
                {cartTotalItems}
              </span>
            )}
          </Link>

          {/* Book Slot — visible md+ */}
          <Link
            href="/appointment"
            className="hidden md:inline-flex items-center gap-1.5 border border-primary text-primary hover:bg-primary hover:text-black font-manrope font-semibold text-xs px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap"
          >
            Book Slot
          </Link>

          {/* Auth */}
          {isLoggedIn ? (
            <div className="relative" ref={userMenuRef}>
              <button
                id="user-menu-btn"
                onClick={() => setIsUserMenuOpen((v) => !v)}
                aria-expanded={isUserMenuOpen}
                className="flex items-center gap-1.5 border border-primary/30 bg-white/5 hover:bg-primary/10 rounded-xl px-2.5 py-2 text-white transition-all duration-300"
              >
                <span className="w-5 h-5 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                  <User2 className="w-3 h-3 text-primary" />
                </span>
                <span className="hidden md:block font-manrope text-xs font-semibold capitalize max-w-[80px] truncate">
                  {userName}
                </span>
                <ChevronDown className={`w-3 h-3 text-white/40 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`absolute right-0 top-full mt-2 w-48 py-2 px-1.5 bg-secondary border border-primary/20 rounded-xl shadow-2xl transition-all duration-200 origin-top-right ${
                isUserMenuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible pointer-events-none'
              }`}>
                <div className="px-3 py-2 border-b border-primary/10 mb-1">
                  <p className="text-[10px] text-white/40 font-manrope uppercase tracking-wider">Signed in as</p>
                  <p className="text-sm text-white font-semibold font-manrope capitalize truncate">{userName}</p>
                </div>
                <Link href="/appointment" onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-manrope text-white/70 hover:text-white hover:bg-white/5 transition-all">
                  My Appointments
                </Link>
                <Link href="/shop" onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-manrope text-white/70 hover:text-white hover:bg-white/5 transition-all">
                  Browse Shop
                </Link>
                <div className="border-t border-primary/10 mt-1 pt-1">
                  <button onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-manrope text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all">
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1 border border-white/15 bg-transparent text-white/80 hover:text-white hover:border-white/30 font-manrope font-semibold text-xs px-3 py-2 rounded-xl transition-all duration-300"
              >
                <LogIn className="w-3.5 h-3.5" />
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1 bg-primary text-black hover:bg-primary/85 font-manrope font-bold text-xs px-3 py-2 rounded-xl transition-all duration-300"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Register
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
