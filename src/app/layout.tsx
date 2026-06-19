import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/components/providers/store-provider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Aurelia Premium Salon - Luxury Hair Care & Styling',
  description: 'Experience premium haircare, styling, and grooming services at Aurelia Premium Salon. Book your luxury salon appointment online today.',
  keywords: 'Aurelia, hair salon, barbershop, styling, haircut, grooming, luxury salon, book slot, Aurelia Salon',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark scroll-smooth">
      <body className="min-h-full flex flex-col bg-background text-foreground font-manrope">
        <StoreProvider>
          <Navbar />
          <main className="flex-grow pt-16 md:pt-20">
            {children}
          </main>
          <Footer />
          <Toaster 
            richColors 
            closeButton 
            theme="dark" 
            position="top-right"
            toastOptions={{
              style: {
                background: '#151515',
                color: '#ffffff',
                border: '1px solid #cea561',
              },
            }}
          />
        </StoreProvider>
      </body>
    </html>
  );
}
