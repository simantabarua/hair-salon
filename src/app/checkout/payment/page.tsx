'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { clearCart } from '@/store/slices/cartSlice';
import PageHeading from '@/components/layout/PageHeading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Lock, 
  CreditCard as CardIcon, 
  CheckCircle2, 
  Truck, 
  Calendar, 
  FileText, 
  ExternalLink 
} from 'lucide-react';

interface CheckoutData {
  shipping: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address: string;
    suite: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    shippingMethod: 'standard' | 'express';
  };
  pricing: {
    subtotal: number;
    discount: number;
    discountAmount: number;
    shippingCost: number;
    vatCost: number;
    totalCost: number;
    promoCode: string;
  };
}

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);

  // States
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [activeTab, setActiveTab] = useState<'card' | 'paypal' | 'apple-pay'>('card');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Card input states
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Load checkout data from localStorage
  useEffect(() => {
    const dataStr = localStorage.getItem('checkout_data');
    if (!dataStr || items.length === 0) {
      toast.error('Session expired or cart is empty.');
      router.push('/cart');
      return;
    }
    // Defer state update to avoid synchronous setState inside useEffect warning
    Promise.resolve().then(() => {
      setCheckoutData(JSON.parse(dataStr));
    });
  }, [items, router]);

  // Card brand detection
  const getCardBrand = (num: string): 'visa' | 'mastercard' | 'amex' | 'discover' | 'generic' => {
    const cleanNum = num.replace(/\D/g, '');
    if (cleanNum.startsWith('4')) return 'visa';
    if (/^5[1-5]/.test(cleanNum) || /^2[2-7]/.test(cleanNum)) return 'mastercard';
    if (/^3[47]/.test(cleanNum)) return 'amex';
    if (cleanNum.startsWith('6')) return 'discover';
    return 'generic';
  };

  const getBrandLogo = (brand: string) => {
    switch (brand) {
      case 'visa':
        return (
          <span className="font-sans italic font-black text-2xl text-[#1a1f71] bg-white px-2 py-0.5 rounded shadow-sm">
            VISA
          </span>
        );
      case 'mastercard':
        return (
          <div className="flex items-center gap-0.5">
            <span className="w-5 h-5 bg-[#eb001b] rounded-full opacity-90"></span>
            <span className="w-5 h-5 bg-[#f79e1b] rounded-full -ml-3 opacity-90"></span>
            <span className="text-white text-xs font-bold font-sans ml-1">Mastercard</span>
          </div>
        );
      case 'amex':
        return (
          <span className="font-sans font-bold text-xs bg-[#0170ce] text-white px-1.5 py-1 rounded shadow-sm">
            AMEX
          </span>
        );
      case 'discover':
        return (
          <span className="font-sans italic font-bold text-sm bg-gradient-to-r from-orange-500 to-yellow-600 text-white px-1.5 py-0.5 rounded shadow-sm">
            DISCOVER
          </span>
        );
      default:
        return (
          <span className="text-white/60 text-xs font-semibold tracking-widest font-manrope">
            CARD
          </span>
        );
    }
  };

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = value.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(value);
    }
  };

  // Format Expiry Date (adds '/' after 2 digits)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setCardExpiry(value.substring(0, 5));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCardCvv(value);
  };

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'card') {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        toast.error('Please fill in all credit card details.');
        return;
      }
      if (cardNumber.replace(/\s/g, '').length < 15) {
        toast.error('Please enter a valid card number.');
        return;
      }
      if (cardExpiry.length < 5) {
        toast.error('Please enter a valid expiry date (MM/YY).');
        return;
      }
      if (cardCvv.length < 3) {
        toast.error('Please enter a valid CVV.');
        return;
      }
    }

    setIsLoading(true);
    toast.info('Connecting to secure payment gateway...');

    setTimeout(() => {
      setIsLoading(false);
      // Generate Order number
      const num = 'GLOW-' + Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(num);
      setShowSuccessOverlay(true);
      toast.success('Payment authorized successfully!');
      
      // Clear redux cart
      dispatch(clearCart());
      
      // Clear storage
      localStorage.removeItem('checkout_data');
    }, 2500);
  };

  const cardBrand = getCardBrand(cardNumber);

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white/60">Loading payment details...</p>
        </div>
      </div>
    );
  }

  const { shipping, pricing } = checkoutData;

  return (
    <div className="relative w-full pb-20 md:pb-32 text-white">
      <PageHeading 
        title="Payment" 
        breadcrumbs={[
          { label: 'Cart', href: '/cart' },
          { label: 'Checkout', href: '/checkout' },
          { label: 'Payment', href: '#' }
        ]} 
      />

      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-12 md:mt-20">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Payment Methods & Inputs */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Tabs Selector */}
            <div className="bg-secondary/20 border border-primary/10 rounded-2xl p-2 flex gap-2 backdrop-blur-md">
              <button
                onClick={() => setActiveTab('card')}
                className={`flex-1 py-3 px-4 rounded-xl font-manrope text-sm font-semibold tracking-wider transition-all uppercase flex items-center justify-center gap-2 ${activeTab === 'card' ? 'bg-primary text-secondary shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                <CardIcon className="w-4 h-4" />
                Credit Card
              </button>
              
              <button
                onClick={() => setActiveTab('paypal')}
                className={`flex-1 py-3 px-4 rounded-xl font-manrope text-sm font-semibold tracking-wider transition-all uppercase flex items-center justify-center gap-2 ${activeTab === 'paypal' ? 'bg-primary text-secondary shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                <span className="italic font-sans font-bold text-xs uppercase text-blue-900 bg-white px-2 py-0.5 rounded">
                  PayPal
                </span>
              </button>

              <button
                onClick={() => setActiveTab('apple-pay')}
                className={`flex-1 py-3 px-4 rounded-xl font-manrope text-sm font-semibold tracking-wider transition-all uppercase flex items-center justify-center gap-2 ${activeTab === 'apple-pay' ? 'bg-primary text-secondary shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                <span className="font-semibold text-sm">Apple / Google Pay</span>
              </button>
            </div>

            {/* Credit Card Flow */}
            {activeTab === 'card' && (
              <div className="space-y-8">
                
                {/* 3D Credit Card Render Overlay */}
                <div className="flex justify-center perspective-1000">
                  <div 
                    className={`relative w-full max-w-[400px] aspect-[1.586] rounded-2xl transition-transform duration-700 preserve-3d shadow-2xl ${isCardFlipped ? 'rotate-y-180' : ''}`}
                  >
                    {/* CARD FRONT */}
                    <div className="absolute inset-0 backface-hidden bg-gradient-to-tr from-[#1b1916] via-[#2f271a] to-[#121110] border border-primary/20 rounded-2xl p-6 flex flex-col justify-between overflow-hidden">
                      {/* Abstract Background Design */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none"></div>
                      
                      {/* Chip & Brand */}
                      <div className="flex justify-between items-start z-10">
                        {/* Chip */}
                        <div className="w-10 h-8 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 rounded-md border border-amber-600/30 relative flex flex-col justify-between p-1 overflow-hidden shadow-inner">
                          <div className="h-full w-full border-r border-b border-black/10"></div>
                        </div>
                        {/* Brand Logo */}
                        <div className="transition-all duration-300">
                          {getBrandLogo(cardBrand)}
                        </div>
                      </div>

                      {/* Card Number */}
                      <div className="text-xl md:text-2xl font-mono tracking-widest text-primary/95 text-center my-4 select-none z-10">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </div>

                      {/* Card Name & Expiry */}
                      <div className="flex justify-between items-end z-10 font-manrope">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-white/40 uppercase tracking-widest block font-semibold">Cardholder</span>
                          <span className="text-sm font-bold text-white uppercase tracking-wider block max-w-[200px] truncate">
                            {cardName || 'YOUR FULL NAME'}
                          </span>
                        </div>
                        <div className="space-y-0.5 text-right">
                          <span className="text-[10px] text-white/40 uppercase tracking-widest block font-semibold">Expires</span>
                          <span className="text-sm font-mono font-bold text-white tracking-wider block">
                            {cardExpiry || 'MM/YY'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CARD BACK */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-tr from-[#1b1916] via-[#2f271a] to-[#121110] border border-primary/20 rounded-2xl py-6 flex flex-col justify-between overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none"></div>

                      {/* Magnetic Strip */}
                      <div className="w-full h-11 bg-black/90"></div>

                      {/* Signature & CVV */}
                      <div className="px-6 space-y-1.5 z-10">
                        <span className="text-[10px] text-white/40 uppercase tracking-widest block font-semibold">CVV/CVC Signature Panel</span>
                        <div className="flex items-center">
                          <div className="flex-1 h-9 bg-white/10 rounded-l-md border border-white/5 flex items-center px-3 text-xs italic text-white/60 tracking-wider font-mono">
                            AUTHORIZED SIGNATURE
                          </div>
                          <div className="w-14 h-9 bg-primary text-secondary rounded-r-md flex items-center justify-center font-mono font-bold text-sm shadow-md">
                            {cardCvv || '•••'}
                          </div>
                        </div>
                      </div>

                      {/* Back details */}
                      <div className="px-6 flex justify-between items-center text-[8px] text-white/30 font-manrope z-10">
                        <span>Luminous Salon & Spa Retail Systems</span>
                        <span>SSL Secure Code</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credit Card inputs */}
                <form onSubmit={handlePayNow} className="bg-secondary/20 border border-primary/10 rounded-2xl p-6 md:p-8 space-y-6 backdrop-blur-md">
                  <h3 className="font-cormorant text-2xl font-bold text-primary border-b border-primary/10 pb-3 flex items-center gap-2">
                    Card details
                  </h3>

                  <div className="space-y-4 font-manrope">
                    
                    <div className="space-y-2">
                      <label htmlFor="cardNameInput" className="block text-xs uppercase tracking-wider text-white/60 font-semibold">Cardholder Name</label>
                      <Input
                        type="text"
                        id="cardNameInput"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        className="h-12 bg-secondary/35 border-primary/10 rounded-xl px-4 focus:border-primary text-sm uppercase"
                        onFocus={() => setIsCardFlipped(false)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="cardNumberInput" className="block text-xs uppercase tracking-wider text-white/60 font-semibold">Card Number</label>
                      <Input
                        type="text"
                        id="cardNumberInput"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4000 1234 5678 9010"
                        className="h-12 bg-secondary/35 border-primary/10 rounded-xl px-4 focus:border-primary text-sm font-mono"
                        onFocus={() => setIsCardFlipped(false)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="cardExpiryInput" className="block text-xs uppercase tracking-wider text-white/60 font-semibold">Expiry Date</label>
                        <Input
                          type="text"
                          id="cardExpiryInput"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          className="h-12 bg-secondary/35 border-primary/10 rounded-xl px-4 focus:border-primary text-sm font-mono text-center"
                          onFocus={() => setIsCardFlipped(false)}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="cardCvvInput" className="block text-xs uppercase tracking-wider text-white/60 font-semibold">CVV Code</label>
                        <Input
                          type="password"
                          id="cardCvvInput"
                          value={cardCvv}
                          onChange={handleCvvChange}
                          placeholder="123"
                          className="h-12 bg-secondary/35 border-primary/10 rounded-xl px-4 focus:border-primary text-sm font-mono text-center"
                          onFocus={() => setIsCardFlipped(true)}
                          onBlur={() => setIsCardFlipped(false)}
                        />
                      </div>
                    </div>

                  </div>

                  {/* Payment Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-secondary font-bold text-sm uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-4"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin"></span>
                        Verifying Transaction...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Pay Securely ${pricing.totalCost.toFixed(2)}
                      </>
                    )}
                  </Button>
                </form>

              </div>
            )}

            {/* PayPal View */}
            {activeTab === 'paypal' && (
              <div className="bg-secondary/20 border border-primary/10 rounded-2xl p-6 md:p-8 space-y-6 backdrop-blur-md text-center py-12">
                <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="italic font-sans font-black text-xl text-blue-400">P</span>
                </div>
                <h3 className="font-cormorant text-2xl font-bold text-white">Pay with PayPal</h3>
                <p className="text-white/60 font-manrope text-sm max-w-md mx-auto">
                  You will be redirected to PayPal to complete your purchase securely. Once confirmed, you will return to view your receipt.
                </p>
                <form onSubmit={handlePayNow} className="max-w-xs mx-auto pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-[#ffc439] hover:bg-[#ffc439]/95 text-blue-950 font-bold rounded-xl flex items-center justify-center gap-2 border border-amber-500"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-blue-950 border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        Proceed to PayPal
                        <ExternalLink className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            )}

            {/* Apple/Google Pay View */}
            {activeTab === 'apple-pay' && (
              <div className="bg-secondary/20 border border-primary/10 rounded-2xl p-6 md:p-8 space-y-6 backdrop-blur-md text-center py-12">
                <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CardIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-cormorant text-2xl font-bold text-white">Express Wallet</h3>
                <p className="text-white/60 font-manrope text-sm max-w-md mx-auto">
                  Pay instantly using your Apple Pay or Google Pay wallet configured on your browser or device.
                </p>
                <form onSubmit={handlePayNow} className="max-w-xs mx-auto pt-4 space-y-3">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-white hover:bg-white/90 text-black font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <span className="tracking-wide"> Pay with Apple Pay</span>
                    )}
                  </Button>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-black hover:bg-black/90 text-white font-bold rounded-xl flex items-center justify-center gap-2 border border-white/20"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <span className="tracking-wide">Buy with Google Pay</span>
                    )}
                  </Button>
                </form>
              </div>
            )}

            <Link href="/checkout" className="flex items-center gap-2 text-white/60 hover:text-primary transition-colors font-manrope text-sm group w-fit">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Shipping Details
            </Link>

          </div>

          {/* Right Column: Mini Bill Details */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Delivery address details preview */}
            <div className="bg-secondary/20 border border-primary/10 rounded-2xl p-6 backdrop-blur-md space-y-4">
              <h4 className="font-cormorant text-xl font-bold text-primary border-b border-primary/10 pb-2 flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Shipping To
              </h4>
              <div className="font-manrope text-sm text-white/80 space-y-1">
                <p className="font-bold text-white">{shipping.firstName} {shipping.lastName}</p>
                <p>{shipping.address} {shipping.suite && `, ${shipping.suite}`}</p>
                <p>{shipping.city}, {shipping.state} {shipping.zip}</p>
                <p className="text-white/60 mt-2 font-semibold">Email: {shipping.email}</p>
                <p className="text-white/60 font-semibold">Phone: {shipping.phone}</p>
              </div>
            </div>

            {/* Total recap */}
            <div className="bg-secondary/20 border border-primary/10 rounded-2xl p-6 md:p-8 backdrop-blur-md space-y-6 shadow-2xl">
              <h4 className="font-cormorant text-xl font-bold text-white border-b border-primary/10 pb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Payment Breakdown
              </h4>

              <div className="font-manrope text-sm space-y-3">
                <div className="flex justify-between text-white/60">
                  <span>Cart Subtotal</span>
                  <span className="font-cormorant text-base font-bold text-white">${pricing.subtotal.toFixed(2)}</span>
                </div>

                {pricing.discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount ({pricing.discount}%)</span>
                    <span className="font-cormorant text-base font-bold">-${pricing.discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-white/60">
                  <span>Shipping Cost</span>
                  <span className="font-cormorant text-base font-bold text-white">
                    {pricing.shippingCost === 0 ? 'FREE' : `$${pricing.shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-white/60">
                  <span>VAT (5%)</span>
                  <span className="font-cormorant text-base font-bold text-white">${pricing.vatCost.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-white border-t border-primary/10 pt-4">
                  <span className="font-bold text-base">Grand Total</span>
                  <span className="font-cormorant text-2xl font-bold text-primary">${pricing.totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SUCCESS OVERLAY / RECEIPT SCREEN */}
      {showSuccessOverlay && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-secondary/40 border border-primary/20 rounded-3xl p-6 md:p-10 max-w-xl w-full text-center space-y-8 shadow-2xl animate-fade-in relative">
            
            {/* Glowing gold backlighting */}
            <div className="absolute inset-0 bg-radial-gradient from-primary/10 to-transparent pointer-events-none rounded-3xl"></div>
            
            {/* Animated Checkmark */}
            <div className="relative w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto border-2 border-primary/30 shadow-lg shadow-primary/15 animate-bounce">
              <CheckCircle2 className="w-14 h-14 text-primary animate-pulse" />
            </div>

            <div className="space-y-3">
              <h2 className="font-cormorant text-3xl md:text-4xl font-bold text-white tracking-wide">
                Order Confirmed!
              </h2>
              <p className="text-white/60 font-manrope text-sm max-w-md mx-auto">
                Thank you for your order. We have sent a confirmation email to <span className="text-primary font-semibold">{shipping.email}</span> with your invoice and shipping updates.
              </p>
            </div>

            {/* Receipt Summary Details */}
            <div className="bg-secondary/40 border border-primary/10 rounded-2xl p-5 md:p-6 text-left space-y-4 font-manrope text-xs md:text-sm">
              <div className="flex justify-between border-b border-primary/10 pb-3">
                <span className="text-white/50 uppercase tracking-wider font-semibold">Order Number</span>
                <span className="font-mono font-bold text-primary tracking-widest">{orderNumber}</span>
              </div>

              <div className="space-y-1">
                <span className="text-white/50 uppercase tracking-wider font-semibold block mb-1">Shipping Address</span>
                <p className="text-white font-semibold">{shipping.firstName} {shipping.lastName}</p>
                <p className="text-white/70">{shipping.address} {shipping.suite && `, ${shipping.suite}`}</p>
                <p className="text-white/70">{shipping.city}, {shipping.state} {shipping.zip}, {shipping.country}</p>
              </div>

              <div className="flex justify-between border-t border-primary/5 pt-3">
                <span className="text-white/50 uppercase tracking-wider font-semibold">Delivery Method</span>
                <span className="font-semibold text-white">
                  {shipping.shippingMethod === 'standard' ? 'Standard Shipping (3-5 Days)' : 'Express Shipping (1-2 Days)'}
                </span>
              </div>

              <div className="flex justify-between border-t border-primary/10 pt-3 text-base">
                <span className="text-white/70 font-bold">Total Paid</span>
                <span className="font-cormorant text-lg font-bold text-primary">${pricing.totalCost.toFixed(2)}</span>
              </div>
            </div>

            {/* Tracking Note */}
            <div className="flex items-center justify-center gap-2 text-white/50 font-manrope text-xs bg-primary/5 border border-primary/10 rounded-xl p-3">
              <Calendar className="w-4 h-4 text-primary" />
              Estimated delivery: {shipping.shippingMethod === 'standard' ? '3 to 5 business days' : '1 to 2 business days'}
            </div>

            {/* CTA */}
            <div>
              <Link href="/shop" onClick={() => setShowSuccessOverlay(false)}>
                <Button className="w-full md:w-auto h-12 px-8 bg-primary hover:bg-primary/90 text-secondary font-bold text-sm uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20">
                  Continue Shopping
                </Button>
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
