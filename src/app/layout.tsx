import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/components/providers/store-provider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Hair Salon - Premium Hairstyling & Grooming Services',
  description: 'Experience premium haircare, styling, and grooming services at our modern luxury salon. Book your appointment online today.',
  keywords: 'hair salon, barbershop, styling, haircut, grooming, luxury salon, book slot',
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
