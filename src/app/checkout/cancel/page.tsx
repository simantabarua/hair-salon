'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  XCircle, 
  ArrowLeft, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

function CancelPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen bg-black text-white py-24 px-4 md:px-8 relative overflow-hidden flex items-center justify-center">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-red-950/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10">
        
        {/* Animated Cancel Icon */}
        <div className="flex flex-col items-center justify-center mb-8 animate-[fadeIn_0.6s_ease-out]">
          <div className="w-20 h-20 bg-zinc-900/80 border border-white/10 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-10 h-10 text-white/50 animate-pulse" />
          </div>
          <span className="text-white/40 text-xs uppercase tracking-widest font-manrope font-semibold mb-2">Checkout Cancelled</span>
          <h1 className="text-3xl md:text-4xl font-cormorant font-bold text-white tracking-tight">
            Payment Not Completed
          </h1>
          <p className="mt-4 text-white/60 font-manrope text-sm max-w-sm mx-auto leading-relaxed">
            You've cancelled the checkout session. Don't worry, your order was not processed, and no charges were made to your account.
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-5 mb-8 text-left space-y-3 backdrop-blur-md">
          <div className="flex items-start gap-2.5 text-white/80">
            <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs font-manrope leading-normal">
              Your items are still waiting in your shopping cart. You can resume checkout at any time.
            </p>
          </div>
          <div className="flex items-start gap-2.5 text-white/80">
            <HelpCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs font-manrope leading-normal">
              Need assistance? Our support team is ready to help resolve any payment issue.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Link href="/checkout">
            <Button className="w-full bg-primary hover:bg-primary-hover text-black font-manrope font-semibold text-xs tracking-wider uppercase py-4 flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Return to Checkout
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5 text-primary font-manrope font-semibold text-xs tracking-wider uppercase py-4">
              View Shopping Cart
            </Button>
          </Link>
          <Link href="/products" className="text-white/40 hover:text-white/60 text-xs font-manrope mt-4 transition block">
            Cancel & Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white/60 font-manrope">Loading details...</p>
        </div>
      </div>
    }>
      <CancelPageContent />
    </Suspense>
  );
}
