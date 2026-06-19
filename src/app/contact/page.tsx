'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Clock, Send, CheckCircle } from 'lucide-react';
import PageHeading from '@/components/layout/PageHeading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    remember: false
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, remember: e.target.checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill out all required fields.');
      return;
    }
    setSubmitted(true);
    // Mock submit behavior
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '', remember: false });
      toast.success('Your message has been sent successfully!');
    }, 2000);
  };

  return (
    <div className="relative w-full pb-20 text-white">
      {/* Page Heading */}
      <PageHeading title="Contact" breadcrumbs={[{ label: 'Contact', href: '/contact' }]} />

      {/* Header & Map Section */}
      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-16 md:mt-24 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-primary font-bold uppercase tracking-wider text-xs block mb-3 font-manrope">Get In Touch</span>
          <h2 className="font-cormorant text-4xl md:text-5xl font-bold mb-4">We&apos;re Always Eager To Hear From You</h2>
          <p className="text-white/60 font-manrope text-sm leading-relaxed">
            Have questions about our styling treatments, product catalog, or custom packages? Send us a line or visit our premium flagship studio.
          </p>
        </div>

        {/* Map Mockup */}
        <div className="relative w-full h-[350px] md:h-[450px] rounded-3xl overflow-hidden border border-primary/20 shadow-2xl">
          {/* We'll use a premium styled map placeholder that has high aesthetic value */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537353153403!3d-37.81720997975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1sen!2sus!4v1625501234567!5m2!1sen!2sus" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }} 
            allowFullScreen={false} 
            loading="lazy"
            title="Google Maps Salon Location"
          ></iframe>
          <div className="absolute inset-0 bg-primary/5 pointer-events-none border border-primary/10 rounded-3xl"></div>
        </div>
      </section>

      {/* Address Widgets Cards */}
      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-16 md:mt-24 grid md:grid-cols-3 gap-8">
        
        {/* Address Card */}
        <div className="bg-secondary/20 border border-primary/10 rounded-2xl p-8 flex flex-col items-center text-center space-y-4 hover:border-primary/30 transition-colors duration-300">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <h4 className="font-cormorant text-2xl font-bold">Studio Location</h4>
          <div className="font-manrope text-sm text-white/70 space-y-1">
            <p>329 Queensberry Street, North</p>
            <p>Melbourne VIC 3051, Australia</p>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="bg-secondary/20 border border-primary/10 rounded-2xl p-8 flex flex-col items-center text-center space-y-4 hover:border-primary/30 transition-colors duration-300">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
            <Phone className="w-8 h-8 text-primary" />
          </div>
          <h4 className="font-cormorant text-2xl font-bold">Quick Contact</h4>
          <div className="font-manrope text-sm text-white/70 space-y-1">
            <p>Mobile: +61 123 456 789</p>
            <p>Support: support@aureliasalon.com</p>
          </div>
        </div>

        {/* Business Hours Card */}
        <div className="bg-secondary/20 border border-primary/10 rounded-2xl p-8 flex flex-col items-center text-center space-y-4 hover:border-primary/30 transition-colors duration-300">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <h4 className="font-cormorant text-2xl font-bold">Business Hours</h4>
          <div className="font-manrope text-sm text-white/70 space-y-1">
            <p>Mon - Saturday: 09:00 - 20:00</p>
            <p>Sunday: Closed</p>
          </div>
        </div>

      </section>

      {/* Send Us Email Section Form */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 mt-20 md:mt-28 bg-secondary/35 border border-primary/15 rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-primary font-bold uppercase tracking-wider text-xs block mb-2 font-manrope">Inquiries</span>
          <h3 className="font-cormorant text-3xl md:text-4xl font-bold">Send Us A Message</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 font-manrope">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 pl-1">
                Your Name *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your name"
                className="bg-secondary/45 text-white border-primary/35 placeholder:text-white/30 h-12 rounded-xl focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 pl-1">
                Email Address *
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
                className="bg-secondary/45 text-white border-primary/35 placeholder:text-white/30 h-12 rounded-xl focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 pl-1">
              Your Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={6}
              placeholder="Tell us what you're looking for..."
              className="w-full bg-secondary/45 text-white border border-primary/35 placeholder:text-white/30 rounded-xl p-3 focus:border-primary focus:outline-none transition-colors text-sm"
            />
          </div>

          <label htmlFor="remember" className="flex items-center gap-3 py-1 text-white/50 text-xs md:text-sm cursor-pointer select-none hover:text-white/80 transition-colors">
            <div className="relative flex items-center justify-center flex-shrink-0">
              <input
                id="remember"
                type="checkbox"
                checked={formData.remember}
                onChange={handleCheckboxChange}
                className="sr-only peer"
              />
              <div className="w-5 h-5 rounded-md border border-primary/30 bg-secondary/40 flex items-center justify-center transition-all peer-checked:bg-primary peer-checked:border-primary peer-checked:text-secondary hover:border-primary cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 hidden peer-checked:block">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <span>
              Save my name, email and website details in this browser for the next time I contact.
            </span>
          </label>

          <div className="pt-2 text-center md:text-left">
            <Button
              type="submit"
              disabled={submitted}
              className="btn-primary h-14 px-8 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-transform active:scale-[0.98] w-full md:w-auto"
            >
              {submitted ? (
                <>
                  <CheckCircle className="w-5 h-5 animate-bounce" /> Sending Message...
                </>
              ) : (
                <>
                  Send Message <Send className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
