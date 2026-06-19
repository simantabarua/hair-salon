'use client';

import React, { useState } from 'react';
import PageHeading from '@/components/layout/PageHeading';
import Link from 'next/link';
import { ShieldCheck, Calendar, DollarSign, ShoppingBag, Lock, HelpCircle, FileText, ArrowRight } from 'lucide-react';

interface TermSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState<string>('intro');

  const SECTIONS: TermSection[] = [
    {
      id: 'intro',
      title: '1. Introduction',
      icon: <ShieldCheck className="w-5 h-5" />,
      content: (
        <div className="space-y-4 font-manrope text-sm leading-relaxed text-white/70">
          <p>
            Welcome to GLOW Hair Salon. By accessing our website, booking appointments, or purchasing products, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
          </p>
          <p>
            These terms govern your relationship with our website, our salon services, and any physical or digital products sold here. If you disagree with any part of these terms, please do not use our services or website.
          </p>
        </div>
      ),
    },
    {
      id: 'bookings',
      title: '2. Bookings & Cancellations',
      icon: <Calendar className="w-5 h-5" />,
      content: (
        <div className="space-y-4 font-manrope text-sm leading-relaxed text-white/70">
          <p>
            Appointments can be booked online through our scheduling system, via phone, or in person. To secure your appointment, we require a valid credit card or contact details on file.
          </p>
          <h4 className="font-cormorant text-lg font-bold text-primary mt-2">Cancellation Policy:</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>Cancellations or modifications made at least <strong>24 hours</strong> in advance will receive a full refund or incur no penalty fee.</li>
            <li>Cancellations made within 24 hours of your scheduled time may be subject to a cancellation fee equal to <strong>50%</strong> of the booked service price.</li>
            <li>No-shows will be charged <strong>100%</strong> of the booked service price to compensate our expert stylists for their time.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'pricing',
      title: '3. Pricing & Services',
      icon: <DollarSign className="w-5 h-5" />,
      content: (
        <div className="space-y-4 font-manrope text-sm leading-relaxed text-white/70">
          <p>
            All prices listed on our Services page are starting prices and are subject to change depending on hair length, texture, and density. Your stylist will provide a final consultation and price estimate prior to commencing any treatment.
          </p>
          <p>
            Payment for all salon services is due immediately upon completion of the service. We accept cash, major credit cards, and digital wallets.
          </p>
        </div>
      ),
    },
    {
      id: 'ecommerce',
      title: '4. E-Commerce & Returns',
      icon: <ShoppingBag className="w-5 h-5" />,
      content: (
        <div className="space-y-4 font-manrope text-sm leading-relaxed text-white/70">
          <p>
            We sell premium hair products on our online Shop. Prices for products are as listed and exclude shipping fees, which are calculated at checkout.
          </p>
          <h4 className="font-cormorant text-lg font-bold text-primary mt-2">Refunds & Returns:</h4>
          <p>
            Unopened products in their original packaging can be returned within <strong>14 days</strong> of purchase for a full refund or salon credit. We do not accept returns on opened, used, or customized hair products due to hygiene standards.
          </p>
        </div>
      ),
    },
    {
      id: 'accounts',
      title: '5. Privacy & User Accounts',
      icon: <Lock className="w-5 h-5" />,
      content: (
        <div className="space-y-4 font-manrope text-sm leading-relaxed text-white/70">
          <p>
            When you register an account on our website, you are responsible for maintaining the confidentiality of your account credentials and password. You agree to notify us immediately of any unauthorized access to your account.
          </p>
          <p>
            We process your personal information in accordance with our Privacy Policy. We do not share your contact details or transaction history with third-party marketers without your consent.
          </p>
        </div>
      ),
    },
    {
      id: 'liability',
      title: '6. Limitation of Liability',
      icon: <HelpCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-4 font-manrope text-sm leading-relaxed text-white/70">
          <p>
            GLOW Hair Salon and its licensed stylists are not liable for any allergic reactions or adverse effects caused by products or chemical treatments, provided that appropriate skin patch testing and allergy history consultations were conducted.
          </p>
          <p>
            We reserve the right to refuse service to anyone demonstrating inappropriate, disrespectful, or abusive behavior toward our staff or other clients.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeading title="Terms & Conditions" breadcrumbs={[{ label: 'Terms & Conditions', href: '/terms' }]} />

      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-4 gap-8 md:gap-12 items-start">
          
          {/* Sidebar Menu */}
          <aside className="lg:col-span-1 space-y-2 sticky top-28 bg-secondary/10 border border-primary/10 rounded-2xl p-4 backdrop-blur-md">
            <h3 className="font-cormorant text-xl font-bold text-primary px-3 pb-3 border-b border-primary/10 mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Table of Contents
            </h3>
            <nav className="flex flex-col gap-1">
              {SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id);
                    document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className={`w-full text-left font-manrope text-sm py-2.5 px-4 rounded-lg flex items-center gap-3 transition-all duration-300 ${
                    activeSection === sec.id
                      ? 'bg-primary text-black font-semibold shadow-lg shadow-primary/20'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {sec.icon}
                  <span>{sec.title.split('. ')[1]}</span>
                </button>
              ))}
            </nav>
            <div className="pt-4 border-t border-primary/10 mt-4 px-2">
              <Link
                href="/register"
                className="font-manrope text-xs font-semibold text-primary hover:text-white flex items-center gap-1.5 transition-colors duration-300 group"
              >
                Back to Register
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </aside>

          {/* Detailed Content */}
          <div className="lg:col-span-3 space-y-12">
            {SECTIONS.map((sec) => (
              <div
                key={sec.id}
                id={sec.id}
                className={`bg-secondary/15 border rounded-2xl p-6 md:p-8 backdrop-blur-md transition-all duration-300 ${
                  activeSection === sec.id
                    ? 'border-primary shadow-2xl shadow-primary/5'
                    : 'border-primary/10'
                }`}
                onMouseEnter={() => setActiveSection(sec.id)}
              >
                <h3 className="font-cormorant text-2xl md:text-3xl font-bold text-primary mb-4 flex items-center gap-3">
                  <span className="p-2 bg-primary/10 border border-primary/20 rounded-xl text-primary">
                    {sec.icon}
                  </span>
                  {sec.title}
                </h3>
                <div className="pl-0 md:pl-12">
                  {sec.content}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
