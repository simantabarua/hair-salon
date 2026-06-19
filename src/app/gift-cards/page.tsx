'use client';

import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import PageHeading from '@/components/layout/PageHeading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addToCart } from '@/store/slices/cartSlice';
import { toast } from 'sonner';
import { Sparkles, Gift, ShoppingBag } from 'lucide-react';

interface GiftCardTemplate {
  id: string;
  name: string;
  className: string;
  bgPreview: string;
}

const TEMPLATES: GiftCardTemplate[] = [
  {
    id: 'golden',
    name: 'Shimmering Gold',
    className: 'bg-gradient-to-br from-[#E2C999] via-[#CEA561] to-[#99753F] text-black border-none',
    bgPreview: 'from-[#E2C999] via-[#CEA561] to-[#99753F]',
  },
  {
    id: 'classic',
    name: 'Signature Onyx',
    className: 'bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-primary/30 text-white',
    bgPreview: 'from-neutral-950 to-neutral-900',
  },
  {
    id: 'modern',
    name: 'Aesthetic Marble',
    className: 'bg-gradient-to-br from-[#1F1F1F] via-[#2F2922] to-[#1F1F1F] border border-primary/20 text-white',
    bgPreview: 'from-[#2F2922] to-[#1F1F1F]',
  },
  {
    id: 'holiday',
    name: 'Royal Crimson',
    className: 'bg-gradient-to-br from-[#5C1414] via-[#7D1B1B] to-[#3B0A0A] border border-primary/20 text-white',
    bgPreview: 'from-[#5C1414] to-[#3B0A0A]',
  },
];

const PRESETS = [50, 100, 150, 200];

export default function GiftCardsPage() {
  const dispatch = useDispatch();

  const [activeTemplate, setActiveTemplate] = useState<GiftCardTemplate>(TEMPLATES[0]);
  const [amountType, setAmountType] = useState<'preset' | 'custom'>('preset');
  const [selectedPreset, setSelectedPreset] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  
  // Customization fields
  const [recipientName, setRecipientName] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [senderName, setSenderName] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const finalAmount = useMemo(() => {
    if (amountType === 'preset') {
      return selectedPreset;
    }
    const parsed = parseFloat(customAmount);
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  }, [amountType, selectedPreset, customAmount]);

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();

    if (finalAmount < 25) {
      toast.error('The minimum gift card amount is $25.00.');
      return;
    }
    if (finalAmount > 2000) {
      toast.error('The maximum gift card amount is $2,000.00.');
      return;
    }
    if (!recipientName || !recipientEmail || !senderName) {
      toast.error('Please enter all required recipient and sender details.');
      return;
    }

    // Add to cart
    const cardId = `gift-${Date.now()}`;
    const cardName = `Salon Gift Card - $${finalAmount.toFixed(2)} (${activeTemplate.name})`;
    
    dispatch(
      addToCart({
        id: cardId,
        name: cardName,
        price: finalAmount,
        image: '/img/Products Images/product-1.png', // Fallback or nice gift card icon image
        quantity: 1,
      })
    );

    toast.success(`Successfully added the $${finalAmount.toFixed(2)} Gift Card to your cart!`);

    // Reset inputs
    setRecipientName('');
    setRecipientEmail('');
    setSenderName('');
    setMessage('');
    setCustomAmount('');
  };

  return (
    <div className="w-full pb-24 text-white font-manrope">
      {/* Page Heading */}
      <PageHeading title="Salon Gift Cards" breadcrumbs={[{ label: 'Gift Cards', href: '/gift-cards' }]} />

      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-12 md:mt-20">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-start">
          
          {/* Card Preview and Design Choice (Left Side) */}
          <div className="space-y-8 lg:sticky lg:top-24">
            
            {/* Live Gift Card Preview */}
            <div className="w-full relative aspect-[1.586/1] max-w-lg mx-auto rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-primary/10">
              
              {/* Main Card Background */}
              <div className={`w-full h-full flex flex-col justify-between p-6 md:p-8 ${activeTemplate.className}`}>
                
                {/* Logo and Premium header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-cormorant text-xl md:text-2xl font-bold tracking-widest uppercase">
                      Aurelia Salon
                    </h3>
                    <p className="text-[9px] uppercase tracking-widest opacity-60">
                      The Art of Hair Transformation
                    </p>
                  </div>
                  <Gift className="w-6 h-6 md:w-8 md:h-8 opacity-80" />
                </div>

                {/* Sender/Recipient details */}
                <div className="space-y-1 my-4">
                  <div className="text-[10px] uppercase tracking-wider opacity-60">For:</div>
                  <div className="font-cormorant text-lg md:text-2xl font-semibold italic">
                    {recipientName || 'Recipient Name'}
                  </div>
                  {message && (
                    <p className="text-xs italic line-clamp-2 opacity-80 mt-1">
                      &ldquo;{message}&rdquo;
                    </p>
                  )}
                </div>

                {/* Amount and Card Code */}
                <div className="flex justify-between items-end border-t border-current/20 pt-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest opacity-60 block">
                      Gift Value
                    </span>
                    <span className="font-cormorant text-2xl md:text-4xl font-bold">
                      ${finalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] tracking-widest uppercase opacity-40 block">
                      Code generated upon checkout
                    </span>
                    <span className="text-[10px] font-mono tracking-wider opacity-85">
                      GFT-XXXX-XXXX
                    </span>
                  </div>
                </div>

              </div>

              {/* Holographic light effect overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/0 mix-blend-overlay"></div>
            </div>

            {/* Template Chooser */}
            <div className="max-w-lg mx-auto">
              <h4 className="font-cormorant text-xl font-bold mb-4 flex items-center gap-2 justify-center lg:justify-start">
                Select Card Style <Sparkles className="w-4 h-4 text-primary" />
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {TEMPLATES.map(tmpl => (
                  <button
                    key={tmpl.id}
                    onClick={() => setActiveTemplate(tmpl)}
                    className={`relative p-4 rounded-xl border transition-all text-xs font-semibold cursor-pointer ${
                      activeTemplate.id === tmpl.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-white/10 bg-secondary/30 text-white hover:border-white/30'
                    }`}
                  >
                    <div className={`h-8 w-full rounded-md bg-gradient-to-br ${tmpl.bgPreview} mb-2`}></div>
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Form and Customization Options (Right Side) */}
          <div className="bg-secondary/35 border border-primary/15 rounded-3xl p-6 md:p-8 shadow-2xl">
            <h3 className="font-cormorant text-3xl font-bold mb-2">Customize Gift Card</h3>
            <p className="text-white/50 text-xs mb-8">
              Send the perfect gift of hair luxury and transformation styling directly to their inbox.
            </p>

            <form onSubmit={handlePurchase} className="space-y-6">
              
              {/* Card Amount selector */}
              <div className="space-y-3">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  Select Card Amount *
                </label>
                
                {/* Mode Selector */}
                <div className="flex gap-2 p-1 bg-secondary/80 rounded-xl border border-primary/10 max-w-xs mb-3">
                  <button
                    type="button"
                    onClick={() => setAmountType('preset')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      amountType === 'preset' ? 'bg-primary text-black' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    Preset Amount
                  </button>
                  <button
                    type="button"
                    onClick={() => setAmountType('custom')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      amountType === 'custom' ? 'bg-primary text-black' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    Custom Amount
                  </button>
                </div>

                {amountType === 'preset' ? (
                  <div className="grid grid-cols-4 gap-3">
                    {PRESETS.map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setSelectedPreset(preset)}
                        className={`h-11 rounded-xl font-bold border transition-all text-sm cursor-pointer ${
                          selectedPreset === preset && amountType === 'preset'
                            ? 'border-primary bg-primary text-black'
                            : 'border-white/10 bg-secondary/30 text-white hover:border-white/30'
                        }`}
                      >
                        ${preset}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm font-semibold">
                      $
                    </span>
                    <Input
                      type="number"
                      min="25"
                      max="2000"
                      value={customAmount}
                      onChange={e => setCustomAmount(e.target.value)}
                      placeholder="Enter amount (min $25)"
                      className="bg-secondary/45 text-white border-primary/35 placeholder:text-white/20 h-11 pl-8 rounded-xl focus:border-primary focus-visible:ring-0 text-sm font-semibold"
                    />
                  </div>
                )}
              </div>

              {/* Sender & Recipient Details */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Recipient Name */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/40">
                    Recipient Name *
                  </label>
                  <Input
                    type="text"
                    value={recipientName}
                    onChange={e => setRecipientName(e.target.value)}
                    required
                    placeholder="Who is this gift for?"
                    className="bg-secondary/45 text-white border-primary/35 placeholder:text-white/20 h-11 rounded-xl focus:border-primary focus-visible:ring-0 text-xs"
                  />
                </div>

                {/* Recipient Email */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/40">
                    Recipient Email *
                  </label>
                  <Input
                    type="email"
                    value={recipientEmail}
                    onChange={e => setRecipientEmail(e.target.value)}
                    required
                    placeholder="Enter recipient email"
                    className="bg-secondary/45 text-white border-primary/35 placeholder:text-white/20 h-11 rounded-xl focus:border-primary focus-visible:ring-0 text-xs"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-1 gap-4">
                {/* Sender Name */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/40">
                    Your Name (Sender) *
                  </label>
                  <Input
                    type="text"
                    value={senderName}
                    onChange={e => setSenderName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="bg-secondary/45 text-white border-primary/35 placeholder:text-white/20 h-11 rounded-xl focus:border-primary focus-visible:ring-0 text-xs"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  Gift Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  maxLength={160}
                  placeholder="Enter a lovely message (max 160 characters)..."
                  rows={3}
                  className="w-full bg-secondary/45 text-white border border-primary/35 placeholder:text-white/20 rounded-xl p-3 focus:border-primary focus:outline-none transition-colors text-xs leading-relaxed"
                />
              </div>

              {/* Call to action */}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full btn-primary h-12 rounded-xl font-bold font-manrope text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-primary/10 transition-all active:scale-[0.98]"
                >
                  Purchase Gift Card <ShoppingBag className="w-4 h-4" />
                </Button>
              </div>

            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
