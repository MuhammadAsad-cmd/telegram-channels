"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ScrollToTop from "@/components/UI/ScrollToTop";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isCp = pathname?.startsWith("/cp");

  if (isCp) {
    return (
      <>
        <Header />
        <main>{children}</main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
