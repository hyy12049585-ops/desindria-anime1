import Navbar from '@/components/layout/Navbar/Navbar';
import { Footer } from "@/components/layout/Footer/Footer";
import type { ReactNode } from "react";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
