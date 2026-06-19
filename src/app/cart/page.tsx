'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { RootState } from '@/store';
import { removeFromCart, updateQuantity, clearCart } from '@/store/slices/cartSlice';
import PageHeading from '@/components/layout/PageHeading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, subtotal } = useSelector((state: RootState) => state.cart);

  // Promo code state
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0); // 0% to start
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  // Shipping & VAT settings
  const shippingCost = subtotal > 150 ? 0 : subtotal > 0 ? 15.0 : 0;
  const vatRate = 0.05; // 5% VAT
  const vatCost = subtotal * vatRate;

  // Total calculation
  const discountAmount = subtotal * (discount / 100);
  const totalCost = subtotal - discountAmount + shippingCost + vatCost;

  const handleQuantityIncrement = (id: string, currentQty: number) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };

  const handleQuantityDecrement = (id: string, currentQty: number) => {
    if (currentQty > 1) {
      dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
    }
  };

  const handleRemove = (id: string, name: string) => {
    dispatch(removeFromCart(id));
    toast.error(`${name} removed from cart`);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (promoCode.toUpperCase() === 'AURELIA10') {
      setDiscount(10);
      setPromoApplied(true);
      toast.success('Promo code AURELIA10 applied: 10% Discount!');
    } else if (promoCode.toUpperCase() === 'SALON20') {
      setDiscount(20);
      setPromoApplied(true);
      toast.success('Promo code SALON20 applied: 20% Discount!');
    } else {
      setPromoError('Invalid promo code. Try "AURELIA10" or "SALON20"');
      toast.error('Invalid promo code. Try "AURELIA10" or "SALON20"');
    }
  };

  const handleCheckout = () => {
    toast.info('Redirecting to checkout page...');
    if (promoApplied) {
      router.push(`/checkout?promo=${promoCode.toUpperCase()}`);
    } else {
      router.push('/checkout');
    }
  };

  return (
    <div className="relative w-full pb-20 md:pb-32 text-white">
      {/* Page Heading */}
      <PageHeading title="My Cart" breadcrumbs={[{ label: 'Cart', href: '/cart' }]} />

      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-12 md:mt-20">
        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-primary/10 max-w-2xl mx-auto space-y-6">
            <div className="relative w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20 animate-pulse">
              <ShoppingBag className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-cormorant text-3xl md:text-4xl font-bold text-white">Your Cart is Empty</h3>
            <p className="text-white/60 font-manrope text-sm max-w-md mx-auto">
              Looks like you haven&apos;t added any salon products to your cart yet. Visit our shop to find premium hair and skin care products.
            </p>
            <Link href="/shop" className="inline-block mt-4">
              <Button className="btn-primary flex items-center gap-2 h-12 px-6 rounded-xl font-semibold">
                Go to Shop <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        ) : (
          /* Main Cart Content */
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Desktop Cart Table */}
              <div className="hidden md:block bg-secondary/20 border border-primary/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-5 grid grid-cols-12 text-center bg-secondary font-cormorant text-xl font-bold tracking-wide border-b border-primary/10 text-primary">
                  <div className="col-span-6 text-left pl-4">Product</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-2">Subtotal</div>
                </div>

                <div className="divide-y divide-primary/5">
                  {items.map((item) => (
                    <div key={item.id} className="p-6 grid grid-cols-12 items-center text-center font-manrope text-sm">
                      {/* Product details */}
                      <div className="col-span-6 flex gap-4 items-center text-left pl-2">
                        <button
                          onClick={() => handleRemove(item.id, item.name)}
                          className="text-white/40 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                          title="Remove item"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-secondary border border-primary/10 flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover object-top" sizes="80px" />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-base mb-1">{item.name}</p>
                          <span className="text-[10px] tracking-wider bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded uppercase font-bold">
                            In Stock
                          </span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 font-semibold text-white/90 text-base">
                        ${item.price.toFixed(2)}
                      </div>

                      {/* Quantity Selector */}
                      <div className="col-span-2 flex justify-center">
                        <div className="flex items-center bg-secondary/80 border border-primary/30 rounded-xl overflow-hidden">
                          <button
                            onClick={() => handleQuantityDecrement(item.id, item.quantity)}
                            className="p-2.5 hover:bg-primary/10 text-white/80 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-bold text-white text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityIncrement(item.id, item.quantity)}
                            className="p-2.5 hover:bg-primary/10 text-white/80 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-2 font-bold text-primary text-base">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Cart List */}
              <div className="md:hidden space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-secondary/25 border border-primary/10 p-4 rounded-2xl relative">
                    <button
                      onClick={() => handleRemove(item.id, item.name)}
                      className="absolute top-3 right-3 text-white/40 hover:text-red-400 p-1.5 rounded-lg bg-secondary/40 border border-white/5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-secondary border border-primary/10 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover object-top" sizes="96px" />
                    </div>

                    <div className="flex flex-col justify-between py-1 font-manrope text-sm">
                      <div>
                        <h4 className="font-semibold text-white text-base line-clamp-1">{item.name}</h4>
                        <p className="text-primary font-bold mt-1">${item.price.toFixed(2)}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center bg-secondary/80 border border-primary/30 rounded-xl overflow-hidden mt-2.5 w-fit">
                        <button
                          onClick={() => handleQuantityDecrement(item.id, item.quantity)}
                          className="p-2 hover:bg-primary/10 text-white/80 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-bold text-white text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityIncrement(item.id, item.quantity)}
                          className="p-2 hover:bg-primary/10 text-white/80 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Input & Clear Cart Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-secondary/10 p-5 rounded-2xl border border-primary/5">
                <form onSubmit={handleApplyPromo} className="flex w-full sm:max-w-md gap-3">
                  <Input
                    type="text"
                    placeholder="Enter Promo Code (e.g. AURELIA10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="bg-secondary/45 text-white border-primary/35 placeholder:text-white/30 h-12 rounded-xl focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button type="submit" className="btn-primary h-12 px-6 rounded-xl font-semibold flex-shrink-0">
                    Apply
                  </Button>
                </form>

                <Button
                  onClick={() => dispatch(clearCart())}
                  variant="outline"
                  className="w-full sm:w-auto border border-red-500/35 text-red-400 hover:bg-red-500/10 font-semibold h-12 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Clear Cart
                </Button>
              </div>

              {promoError && <p className="text-red-400 text-xs font-manrope font-semibold pl-2">{promoError}</p>}
              {promoApplied && <p className="text-green-400 text-xs font-manrope font-semibold pl-2">Promo code applied successfully!</p>}
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="lg:col-span-4 bg-secondary/35 border border-primary/15 rounded-2xl p-6 md:p-8 shadow-2xl sticky top-24 space-y-6 font-manrope">
              <h3 className="font-cormorant text-3xl font-bold border-b border-primary/10 pb-4 text-white">
                Cart Totals
              </h3>

              <div className="space-y-4 text-sm font-medium">
                {/* Subtotal */}
                <div className="flex justify-between items-center text-white/70">
                  <span>Cart Subtotal</span>
                  <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
                </div>

                {/* Promo Code Discount */}
                {discount > 0 && (
                  <div className="flex justify-between items-center text-green-400">
                    <span>Discount ({discount}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                {/* Shipping */}
                <div className="flex justify-between items-center text-white/70">
                  <span>Shipping Cost</span>
                  <span className="text-white font-semibold">
                    {shippingCost === 0 ? (
                      <span className="text-primary font-bold">FREE</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>

                {/* VAT Tax */}
                <div className="flex justify-between items-center text-white/70">
                  <span>VAT & Service Tax (5%)</span>
                  <span className="text-white font-semibold">${vatCost.toFixed(2)}</span>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center border-t border-primary/10 pt-4 text-lg">
                  <span className="font-semibold text-white">Grand Total</span>
                  <span className="font-bold text-primary text-xl">${totalCost.toFixed(2)}</span>
                </div>
              </div>

              {/* Progress Bar (Free Shipping nudge) */}
              {subtotal < 150 && (
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 space-y-2 text-xs text-white/60">
                  <p>
                    Add <span className="text-primary font-bold">${(150 - subtotal).toFixed(2)}</span> more to unlock <span className="text-primary font-bold">FREE Shipping!</span>
                  </p>
                  <div className="w-full bg-secondary/80 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-500"
                      style={{ width: `${(subtotal / 150) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Proceed Button */}
              <Button
                onClick={handleCheckout}
                className="btn-primary w-full h-14 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-primary/10 transition-all active:scale-[0.98]"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </Button>

              <div className="text-center">
                <Link href="/shop" className="text-xs text-primary hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
            
          </div>
        )}
      </section>
    </div>
  );
}
