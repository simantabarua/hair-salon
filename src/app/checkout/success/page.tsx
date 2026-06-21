'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/store/slices/cartSlice';
import { apiClient } from '@/lib/apiClient';
import { OrderDTO, OrderItemDTO, ProductDTO } from '@/types/api';
import { 
  CheckCircle, 
  ShoppingBag, 
  ArrowRight, 
  FileText, 
  CreditCard, 
  Calendar,
  Printer,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';

function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  
  const orderId = searchParams.get('order_id');
  const sessionId = searchParams.get('session_id');

  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(true);

  // Clear cart immediately on load
  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  // Fetch order details
  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const data = await apiClient.get<OrderDTO>(`/api/v1/orders/${orderId}`);
        setOrder(data);
      } catch (err: any) {
        console.error('Failed to fetch order:', err);
        setError('We could not retrieve the receipt details, but your payment was successful.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const getProductName = (item: OrderItemDTO) => {
    if (typeof item.productId === 'object' && item.productId !== null) {
      return (item.productId as ProductDTO).name;
    }
    return 'Premium Product';
  };

  const getProductImage = (item: OrderItemDTO) => {
    if (typeof item.productId === 'object' && item.productId !== null) {
      return (item.productId as ProductDTO).image;
    }
    return '';
  };

  const getProductSku = (item: OrderItemDTO) => {
    if (typeof item.productId === 'object' && item.productId !== null) {
      return (item.productId as ProductDTO).sku;
    }
    return 'SKU-N/A';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 md:px-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        
        {/* Animated Checkmark and Title */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center mb-6 animate-pulse">
            <CheckCircle className="w-10 h-10 text-primary animate-[bounce_1.5s_infinite]" />
          </div>
          <span className="text-primary text-xs uppercase tracking-widest font-manrope font-semibold mb-2">Payment Confirmed</span>
          <h1 className="text-4xl md:text-5xl font-cormorant font-bold text-white tracking-tight">
            Thank you for your order
          </h1>
          <p className="mt-3 text-white/60 font-manrope text-sm max-w-md mx-auto">
            Your transaction has been processed successfully. A confirmation email with details has been sent.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Link href="/products">
            <Button className="bg-primary hover:bg-primary-hover text-black font-manrope font-semibold text-xs tracking-wider uppercase px-6 py-4 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="border-primary/20 hover:bg-primary/5 text-primary font-manrope font-semibold text-xs tracking-wider uppercase px-6 py-4 flex items-center gap-2">
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Loader or Error */}
        {loading && (
          <div className="bg-zinc-900/30 border border-primary/10 rounded-xl p-8 backdrop-blur-md max-w-xl mx-auto flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white/60 font-manrope text-xs">Retrieving order and receipt details...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-6 max-w-xl mx-auto mb-8">
            <p className="text-red-400 font-manrope text-xs font-semibold">{error}</p>
            {orderId && (
              <p className="text-white/40 font-manrope text-2xs mt-2 uppercase tracking-widest">
                Order ID: {orderId}
              </p>
            )}
          </div>
        )}

        {/* Premium Receipt Card */}
        {order && (
          <div className="bg-zinc-950/80 border border-primary/10 rounded-xl max-w-2xl mx-auto text-left overflow-hidden shadow-2xl backdrop-blur-lg animate-[fadeIn_0.5s_ease-out]">
            {/* Header info */}
            <div className="p-6 md:p-8 border-b border-primary/10 bg-zinc-900/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-white/40 text-2xs uppercase tracking-wider font-semibold block mb-1">Receipt / Summary</span>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-cormorant font-bold text-white tracking-wide">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </h2>
                  <span className="bg-primary/10 text-primary text-3xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider font-manrope">
                    Paid
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white/80 hover:text-white px-3 py-1.5 rounded-md text-xs font-manrope transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>

            {/* Receipt Details Toggle */}
            <div className="p-6 md:p-8 space-y-6">
              
              {/* Order Meta details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-manrope border-b border-white/5 pb-6">
                <div>
                  <span className="text-white/40 block mb-1">Date</span>
                  <div className="flex items-center gap-1.5 text-white/90">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
                <div>
                  <span className="text-white/40 block mb-1">Payment Method</span>
                  <div className="flex items-center gap-1.5 text-white/90">
                    <CreditCard className="w-3.5 h-3.5 text-primary" />
                    <span>Card via Stripe</span>
                  </div>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <span className="text-white/40 block mb-1">Reference Code</span>
                  <div className="flex items-center gap-1.5 text-white/90">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    <span className="font-mono text-2xs truncate select-all">{order.id}</span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-primary font-bold font-manrope mb-4">Purchased Products</h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => {
                    const productName = getProductName(item);
                    const productImage = getProductImage(item);
                    const productSku = getProductSku(item);
                    
                    return (
                      <div key={index} className="flex justify-between items-center gap-4 text-sm font-manrope">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 bg-zinc-900 border border-white/5 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {productImage ? (
                              <Image 
                                src={productImage} 
                                alt={productName} 
                                fill 
                                className="object-cover"
                              />
                            ) : (
                              <ShoppingBag className="w-5 h-5 text-white/20" />
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-white line-clamp-1">{productName}</span>
                            <span className="text-white/40 text-3xs font-mono uppercase tracking-wider block">SKU: {productSku}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-white/80 block text-xs font-semibold">
                            ${item.price.toFixed(2)} x {item.quantity}
                          </span>
                          <span className="text-primary text-xs font-bold font-cormorant">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total calculations */}
              <div className="border-t border-white/5 pt-6 space-y-2">
                <div className="flex justify-between text-xs font-manrope text-white/60">
                  <span>Subtotal</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-manrope text-white/60">
                  <span>Shipping & Tax</span>
                  <span className="text-primary text-3xs uppercase tracking-wider font-semibold">Included</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                  <span className="font-bold text-sm uppercase tracking-wider text-white">Total Amount Paid</span>
                  <span className="font-cormorant text-2xl font-bold text-primary">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white/60 font-manrope">Loading receipt details...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
