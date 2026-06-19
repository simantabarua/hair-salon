'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import PageHeading from '@/components/layout/PageHeading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ArrowLeft, CreditCard, ShoppingBag, ShieldCheck } from 'lucide-react';

interface ShippingForm {
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
}

interface FormErrors {
  [key: string]: string;
}

function CheckoutFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, subtotal } = useSelector((state: RootState) => state.cart);

  // Read initial promo code from query param
  const initialPromo = searchParams.get('promo') || '';

  // Form states
  const [formData, setFormData] = useState<ShippingForm>({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    suite: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    shippingMethod: 'standard',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Promo code states
  const [promoCode, setPromoCode] = useState(initialPromo);
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'GLOW10') {
      setDiscount(10);
      setPromoApplied(true);
      setPromoError('');
      toast.success('Promo code GLOW10 applied: 10% Discount!');
    } else if (cleanCode === 'SALON20') {
      setDiscount(20);
      setPromoApplied(true);
      setPromoError('');
      toast.success('Promo code SALON20 applied: 20% Discount!');
    } else if (cleanCode) {
      setPromoError('Invalid promo code');
      setPromoApplied(false);
      setDiscount(0);
    }
  };

  // Apply initial promo code if present
  useEffect(() => {
    if (initialPromo) {
      Promise.resolve().then(() => {
        applyPromoCode(initialPromo);
      });
    }
  }, [initialPromo]);

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      toast.error('Your cart is empty. Redirecting to cart...');
      router.push('/cart');
    }
  }, [items, router]);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    applyPromoCode(promoCode);
  };

  // Pricing calculations
  const discountAmount = subtotal * (discount / 100);
  const shippingCost = formData.shippingMethod === 'standard' 
    ? (subtotal - discountAmount > 150 ? 0 : 15.0) 
    : 25.0;
  const vatRate = 0.05; // 5% VAT
  const vatCost = (subtotal - discountAmount) * vatRate;
  const totalCost = subtotal - discountAmount + shippingCost + vatCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.address) errors.address = 'Street address is required';
    if (!formData.city) errors.city = 'City is required';
    if (!formData.state) errors.state = 'State/Province is required';
    if (!formData.zip) errors.zip = 'ZIP/Postal code is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    // Save check out data to localStorage to retrieve on the payment page
    const checkoutData = {
      shipping: formData,
      pricing: {
        subtotal,
        discount,
        discountAmount,
        shippingCost,
        vatCost,
        totalCost,
        promoCode: promoApplied ? promoCode : '',
      }
    };

    localStorage.setItem('checkout_data', JSON.stringify(checkoutData));
    toast.success('Shipping information saved. Redirecting to payment...');
    router.push('/checkout/payment');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white/60">Redirecting to cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full pb-20 md:pb-32 text-white">
      <PageHeading 
        title="Checkout" 
        breadcrumbs={[
          { label: 'Cart', href: '/cart' },
          { label: 'Checkout', href: '/checkout' }
        ]} 
      />

      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-12 md:mt-20">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Shipping Form Column (Left) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
            
            {/* Contact Details Card */}
            <div className="bg-secondary/20 border border-primary/10 rounded-2xl p-6 md:p-8 space-y-6 backdrop-blur-md">
              <h3 className="font-cormorant text-2xl font-bold text-primary border-b border-primary/10 pb-3 flex items-center gap-2">
                <span className="text-xs w-6 h-6 rounded-full bg-primary/10 text-primary border border-primary/30 flex items-center justify-center font-manrope font-bold">1</span>
                Contact Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs uppercase tracking-wider text-white/60 font-manrope font-semibold">Email Address *</label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. name@example.com"
                    className={`h-12 bg-secondary/35 border-primary/10 rounded-xl px-4 ${formErrors.email ? 'border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500' : 'focus:border-primary focus-visible:ring-primary/20'}`}
                  />
                  {formErrors.email && <p className="text-red-400 text-xs mt-1 font-manrope">{formErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-xs uppercase tracking-wider text-white/60 font-manrope font-semibold">Phone Number *</label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +1 555-0199"
                    className={`h-12 bg-secondary/35 border-primary/10 rounded-xl px-4 ${formErrors.phone ? 'border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500' : 'focus:border-primary focus-visible:ring-primary/20'}`}
                  />
                  {formErrors.phone && <p className="text-red-400 text-xs mt-1 font-manrope">{formErrors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Shipping Address Card */}
            <div className="bg-secondary/20 border border-primary/10 rounded-2xl p-6 md:p-8 space-y-6 backdrop-blur-md">
              <h3 className="font-cormorant text-2xl font-bold text-primary border-b border-primary/10 pb-3 flex items-center gap-2">
                <span className="text-xs w-6 h-6 rounded-full bg-primary/10 text-primary border border-primary/30 flex items-center justify-center font-manrope font-bold">2</span>
                Shipping Address
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-xs uppercase tracking-wider text-white/60 font-manrope font-semibold">First Name *</label>
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    className={`h-12 bg-secondary/35 border-primary/10 rounded-xl px-4 ${formErrors.firstName ? 'border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500' : 'focus:border-primary'}`}
                  />
                  {formErrors.firstName && <p className="text-red-400 text-xs mt-1 font-manrope">{formErrors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-xs uppercase tracking-wider text-white/60 font-manrope font-semibold">Last Name *</label>
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    className={`h-12 bg-secondary/35 border-primary/10 rounded-xl px-4 ${formErrors.lastName ? 'border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500' : 'focus:border-primary'}`}
                  />
                  {formErrors.lastName && <p className="text-red-400 text-xs mt-1 font-manrope">{formErrors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="block text-xs uppercase tracking-wider text-white/60 font-manrope font-semibold">Street Address *</label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="House number and street name"
                  className={`h-12 bg-secondary/35 border-primary/10 rounded-xl px-4 ${formErrors.address ? 'border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500' : 'focus:border-primary'}`}
                />
                {formErrors.address && <p className="text-red-400 text-xs mt-1 font-manrope">{formErrors.address}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="suite" className="block text-xs uppercase tracking-wider text-white/60 font-manrope font-semibold">Apartment, suite, unit etc. (Optional)</label>
                <Input
                  type="text"
                  id="suite"
                  name="suite"
                  value={formData.suite}
                  onChange={handleInputChange}
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  className="h-12 bg-secondary/35 border-primary/10 rounded-xl px-4 focus:border-primary"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label htmlFor="city" className="block text-xs uppercase tracking-wider text-white/60 font-manrope font-semibold">Town / City *</label>
                  <Input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className={`h-12 bg-secondary/35 border-primary/10 rounded-xl px-4 ${formErrors.city ? 'border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500' : 'focus:border-primary'}`}
                  />
                  {formErrors.city && <p className="text-red-400 text-xs mt-1 font-manrope">{formErrors.city}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="state" className="block text-xs uppercase tracking-wider text-white/60 font-manrope font-semibold">State / Province *</label>
                  <Input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className={`h-12 bg-secondary/35 border-primary/10 rounded-xl px-4 ${formErrors.state ? 'border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500' : 'focus:border-primary'}`}
                  />
                  {formErrors.state && <p className="text-red-400 text-xs mt-1 font-manrope">{formErrors.state}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="zip" className="block text-xs uppercase tracking-wider text-white/60 font-manrope font-semibold">Postcode / ZIP *</label>
                  <Input
                    type="text"
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder="Postcode"
                    className={`h-12 bg-secondary/35 border-primary/10 rounded-xl px-4 ${formErrors.zip ? 'border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500' : 'focus:border-primary'}`}
                  />
                  {formErrors.zip && <p className="text-red-400 text-xs mt-1 font-manrope">{formErrors.zip}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="country" className="block text-xs uppercase tracking-wider text-white/60 font-manrope font-semibold">Country / Region *</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full h-12 bg-secondary/35 border border-primary/10 rounded-xl px-4 outline-none text-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-manrope text-sm appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23cea561' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.25rem',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <option value="United States" className="bg-secondary text-white">United States</option>
                  <option value="Canada" className="bg-secondary text-white">Canada</option>
                  <option value="United Kingdom" className="bg-secondary text-white">United Kingdom</option>
                  <option value="Australia" className="bg-secondary text-white">Australia</option>
                  <option value="Germany" className="bg-secondary text-white">Germany</option>
                  <option value="France" className="bg-secondary text-white">France</option>
                </select>
              </div>
            </div>

            {/* Shipping Method Card */}
            <div className="bg-secondary/20 border border-primary/10 rounded-2xl p-6 md:p-8 space-y-6 backdrop-blur-md">
              <h3 className="font-cormorant text-2xl font-bold text-primary border-b border-primary/10 pb-3 flex items-center gap-2">
                <span className="text-xs w-6 h-6 rounded-full bg-primary/10 text-primary border border-primary/30 flex items-center justify-center font-manrope font-bold">3</span>
                Shipping Method
              </h3>

              <div className="space-y-4">
                {/* Standard Shipping option */}
                <label className={`flex items-center justify-between p-5 border rounded-2xl cursor-pointer transition-all duration-350 ${formData.shippingMethod === 'standard' ? 'border-primary bg-primary/5' : 'border-primary/10 bg-secondary/10 hover:border-primary/30'}`}>
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="standard"
                      checked={formData.shippingMethod === 'standard'}
                      onChange={() => setFormData(prev => ({ ...prev, shippingMethod: 'standard' }))}
                      className="w-5 h-5 accent-primary"
                    />
                    <div className="space-y-1">
                      <span className="font-manrope text-sm font-bold block text-white">Standard Shipping</span>
                      <span className="font-manrope text-xs text-white/50 block">3 - 5 Business Days Delivery</span>
                    </div>
                  </div>
                  <span className="font-cormorant text-lg font-bold text-primary">
                    {subtotal - discountAmount > 150 ? 'FREE' : '$15.00'}
                  </span>
                </label>

                {/* Express Shipping option */}
                <label className={`flex items-center justify-between p-5 border rounded-2xl cursor-pointer transition-all duration-350 ${formData.shippingMethod === 'express' ? 'border-primary bg-primary/5' : 'border-primary/10 bg-secondary/10 hover:border-primary/30'}`}>
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      checked={formData.shippingMethod === 'express'}
                      onChange={() => setFormData(prev => ({ ...prev, shippingMethod: 'express' }))}
                      className="w-5 h-5 accent-primary"
                    />
                    <div className="space-y-1">
                      <span className="font-manrope text-sm font-bold block text-white">Express Shipping</span>
                      <span className="font-manrope text-xs text-white/50 block">1 - 2 Business Days Delivery</span>
                    </div>
                  </div>
                  <span className="font-cormorant text-lg font-bold text-primary">$25.00</span>
                </label>
              </div>
            </div>

            {/* Back to Cart & Submit Button */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <Link href="/cart" className="flex items-center gap-2 text-white/60 hover:text-primary transition-colors font-manrope text-sm group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Cart
              </Link>
              
              <Button type="submit" className="w-full md:w-auto h-14 px-8 bg-primary hover:bg-primary/90 text-secondary font-bold text-sm uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                <CreditCard className="w-5 h-5" />
                Proceed to Payment
              </Button>
            </div>

          </form>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-secondary/20 border border-primary/10 rounded-2xl p-6 md:p-8 backdrop-blur-md space-y-6 shadow-2xl">
              <h3 className="font-cormorant text-2xl font-bold text-white border-b border-primary/10 pb-3 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Order Summary
              </h3>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto pr-2 divide-y divide-primary/5 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 pt-4 first:pt-0 items-center">
                    <div className="relative w-16 h-16 rounded-xl bg-secondary/40 border border-primary/10 overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover p-1"
                        sizes="64px"
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-secondary text-2xs font-bold rounded-full flex items-center justify-center shadow-md">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-manrope text-sm font-bold text-white truncate">{item.name}</h4>
                      <p className="font-manrope text-xs text-white/50 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-cormorant text-base font-bold text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Coupon Form */}
              <form onSubmit={handleApplyPromo} className="pt-4 border-t border-primary/10 space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Coupon Code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="h-10 bg-secondary/35 border-primary/10 rounded-lg px-3 focus:border-primary text-xs tracking-wider"
                  />
                  <Button type="submit" variant="outline" className="h-10 px-4 text-xs font-semibold uppercase tracking-wider rounded-lg border-primary/20 text-primary hover:bg-primary hover:text-secondary">
                    Apply
                  </Button>
                </div>
                {promoError && <p className="text-red-400 text-xs font-manrope">{promoError}</p>}
                {promoApplied && (
                  <p className="text-green-400 text-xs font-manrope flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Coupon code applied ({discount}% off)
                  </p>
                )}
              </form>

              {/* Pricing Breakdowns */}
              <div className="border-t border-primary/10 pt-4 space-y-3 font-manrope text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span className="font-cormorant text-base font-bold text-white">${subtotal.toFixed(2)}</span>
                </div>

                {promoApplied && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount ({discount}%)</span>
                    <span className="font-cormorant text-base font-bold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  <span className="font-cormorant text-base font-bold text-white">
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-white/60">
                  <span>VAT (5%)</span>
                  <span className="font-cormorant text-base font-bold text-white">${vatCost.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-white/60 border-b border-primary/5 pb-3">
                  <span>Estimated Delivery</span>
                  <span className="text-xs font-semibold text-white/80">
                    {formData.shippingMethod === 'standard' ? '3-5 Business Days' : '1-2 Business Days'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-white pt-2">
                  <span className="font-bold text-base">Total Cost</span>
                  <span className="font-cormorant text-2xl font-bold text-primary">${totalCost.toFixed(2)}</span>
                </div>
              </div>

              {/* Secure checkout info */}
              <div className="border-t border-primary/5 pt-4 flex items-center justify-center gap-2 text-white/40 text-2xs uppercase tracking-wider font-manrope font-semibold">
                <ShieldCheck className="w-4 h-4 text-primary" />
                128-Bit SSL Secure Checkout
              </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white/60 font-manrope">Loading checkout details...</p>
        </div>
      </div>
    }>
      <CheckoutFormContent />
    </Suspense>
  );
}
