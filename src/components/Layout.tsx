import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#171717]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
