'use client';

import React, { useState } from 'react';
import { Send, CheckCircle, HelpCircle } from 'lucide-react';
import PageHeading from '@/components/layout/PageHeading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Would I get a full refund If I cancel a reservation?',
    answer: 'Yes. If you cancel your appointment at least 24 hours in advance, you will receive a full refund. Cancellations made within 24 hours of the scheduled time may be subject to a 50% reservation fee.',
  },
  {
    id: 'faq-2',
    question: 'How can I book an appointment with a specific stylist?',
    answer: 'During the booking process on our Appointment page, you will see a dropdown to select your preferred expert stylist. You can also view stylist bios on our Team page to find the best match for your hair goals.',
  },
  {
    id: 'faq-3',
    question: 'What hair care products do you use and sell?',
    answer: 'We exclusively use and sell premium, organic hair care products that are sulfate-free, paraben-free, and cruelty-free. These products help maintain the long-term health and shine of your hair.',
  },
  {
    id: 'faq-4',
    question: 'Do you offer services for weddings or special events?',
    answer: 'Absolutely! We offer specialized Wedding & Special Event styling packages. This includes pre-event hair trials, styling on the day of the event, makeup options, and styling for the entire bridal party.',
  },
  {
    id: 'faq-5',
    question: 'Can I purchase gift cards or vouchers?',
    answer: 'Yes, we offer electronic gift cards that can be customized with any value and emailed directly to the recipient. You can purchase them at our salon front desk or via our contact page.',
  },
  {
    id: 'faq-6',
    question: 'How long does a typical coloring or balayage treatment take?',
    answer: 'A standard single-process color takes about 1.5 to 2 hours. More complex techniques like balayage, highlights, or color corrections can take anywhere from 3 to 5 hours, depending on hair length and density.',
  },
  {
    id: 'faq-7',
    question: 'Do you accept walk-in clients?',
    answer: 'While we highly recommend booking in advance to guarantee your preferred time slot and stylist, we do accept walk-in clients whenever there is open availability in our schedule.',
  },
  {
    id: 'faq-8',
    question: 'What are your business hours on holidays?',
    answer: 'Our salon is closed on major public holidays. For minor holidays, our hours may vary. We always announce holiday hours and closures on our website and social channels in advance.',
  },
];

export default function FAQPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    remember: false,
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
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '', remember: false });
      toast.success('Thank you! Your question has been submitted successfully.');
    }, 2000);
  };

  return (
    <div className="w-full pb-24 text-white">
      {/* Page Heading */}
      <PageHeading title="FAQ" breadcrumbs={[{ label: 'FAQ', href: '/faq' }]} />

      {/* FAQs Section */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 mt-16 md:mt-24">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-bold uppercase tracking-wider text-xs block mb-3 font-manrope">Verify Your Doubts</span>
          <h2 className="font-cormorant text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-white/60 font-manrope text-sm leading-relaxed">
            Can&apos;t find the answer you&apos;re looking for? Browse our commonly asked questions below or drop us a custom inquiry.
          </p>
        </div>

        <Accordion className="space-y-4">
          {FAQS.map(faq => (
            <AccordionItem 
              key={faq.id} 
              value={faq.id} 
              className="border-none"
            >
              <AccordionTrigger 
                className="w-full text-base md:text-lg font-cormorant font-medium py-4 px-6 md:px-8 border border-primary/20 rounded-xl data-[state=open]:bg-primary data-[state=open]:text-black hover:no-underline transition-all duration-300 [&>svg]:text-primary data-[state=open]:[&>svg]:text-black focus-visible:ring-1 focus-visible:ring-primary/50"
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent 
                className="px-6 md:px-8 py-4 text-white/70 font-manrope text-sm leading-relaxed bg-secondary/15 rounded-b-xl border-x border-b border-primary/10 -mt-1 pt-6"
              >
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Custom Questions Form Section */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 mt-24 md:mt-32">
        <div className="bg-secondary/35 border border-primary/15 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-primary font-bold uppercase tracking-wider text-xs block mb-2 font-manrope">Inquiries</span>
            <h3 className="font-cormorant text-3xl md:text-4xl font-bold">For More Questions</h3>
            <p className="text-white/50 font-manrope text-sm mt-2">
              If your question isn&apos;t listed, feel free to fill out the form below. We respond within 24 hours.
            </p>
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
                rows={5}
                placeholder="Type your question here..."
                className="w-full bg-secondary/45 text-white border border-primary/35 placeholder:text-white/30 rounded-xl p-3 focus:border-primary focus:outline-none transition-colors text-sm"
              />
            </div>

            <div className="flex items-center gap-2 py-1">
              <input
                id="remember-faq"
                type="checkbox"
                checked={formData.remember}
                onChange={handleCheckboxChange}
                className="h-5 w-5 rounded bg-secondary border border-primary text-primary focus:ring-0 focus:outline-none cursor-pointer"
              />
              <label htmlFor="remember-faq" className="text-white/50 text-xs md:text-sm cursor-pointer select-none">
                Save my name and email in this browser for the next time I submit a question.
              </label>
            </div>

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
        </div>
      </section>
    </div>
  );
}
