'use client';

import React from 'react';
import PageHeading from '@/components/layout/PageHeading';
import { ShieldCheck, Mail, Globe, Lock, Eye, RefreshCw } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: <Eye className="w-5 h-5 text-primary" />,
      title: '1. Information We Collect',
      content: 'We collect personal information that you voluntarily provide to us when booking an appointment, signing up for our newsletter, purchasing gift cards or products, or contacting us. This may include your name, email address, phone number, payment details, styling history, and notes on hair preferences.'
    },
    {
      icon: <Globe className="w-5 h-5 text-primary" />,
      title: '2. How We Use Your Information',
      content: 'Your information is used to schedule and manage your styling appointments, process secure e-commerce transactions, respond to customer service requests, send transactional emails or promotional styling updates, and continuously improve our salon services.'
    },
    {
      icon: <Lock className="w-5 h-5 text-primary" />,
      title: '3. Data Protection & Security',
      content: 'We implement industry-standard physical, administrative, and technological security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. We utilize SSL encryption for all web traffic and tokenized credit card processing via certified gateway processors.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-primary" />,
      title: '4. Third-Party Disclosures',
      content: 'We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted partners who assist us in operating our website, conducting our business, or serving our clients, as long as those parties agree to keep this information strictly confidential.'
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-primary" />,
      title: '5. Policy Updates & Revisions',
      content: 'We reserve the right to modify this privacy policy at any time. Changes and clarifications will take effect immediately upon their posting on this page. We encourage you to review this policy periodically to stay informed about how we protect your information.'
    }
  ];

  return (
    <div className="w-full pb-24 text-white font-manrope">
      {/* Page Heading */}
      <PageHeading title="Privacy Policy" breadcrumbs={[{ label: 'Privacy', href: '/privacy' }]} />

      <section className="max-w-4xl mx-auto px-4 md:px-8 mt-16 md:mt-24">
        
        {/* Intro Card */}
        <div className="bg-secondary/35 border border-primary/15 rounded-3xl p-6 md:p-8 shadow-2xl mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-cormorant text-xl font-bold">Your Trust is Our Commitment</h3>
              <p className="text-[10px] text-white/40 uppercase font-semibold">Last Updated: June 19, 2026</p>
            </div>
          </div>
          <p className="text-white/70 text-xs md:text-sm leading-relaxed">
            At Aurelia Premium Salon, we respect your privacy and are committed to protecting it. This Privacy Policy describes the types of information we may collect from you or that you may provide when you visit our website or receive treatments at our physical salons, and our practices for collecting, using, maintaining, and protecting that data.
          </p>
        </div>

        {/* Detailed Sections Checklist */}
        <div className="space-y-8">
          {sections.map((section, idx) => (
            <div 
              key={idx} 
              className="bg-secondary/20 border border-white/5 hover:border-primary/20 rounded-2xl p-6 md:p-8 transition-all duration-300 shadow-lg"
            >
              <h4 className="font-cormorant text-xl md:text-2xl font-bold text-white flex items-center gap-3 mb-4">
                {section.icon}
                {section.title}
              </h4>
              <p className="text-white/75 text-xs md:text-sm leading-relaxed pl-8">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Contact/Support Footer */}
        <div className="bg-secondary/30 border border-primary/10 rounded-3xl p-8 text-center mt-12 shadow-xl">
          <h4 className="font-cormorant text-2xl font-bold mb-2">Questions or Concerns?</h4>
          <p className="text-xs text-white/50 mb-6 max-w-lg mx-auto">
            If you have any questions regarding this Privacy Policy, your data rights, or data usage, feel free to contact our support administration.
          </p>
          <a 
            href="mailto:privacy@aureliasalon.com" 
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary border border-primary/30 bg-primary/5 px-6 py-3 rounded-xl hover:bg-primary hover:text-black transition-all font-bold"
          >
            Contact Privacy Officer <Mail className="w-4 h-4" />
          </a>
        </div>

      </section>
    </div>
  );
}
