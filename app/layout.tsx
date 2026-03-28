"use client"; // We make the layout a client component to access the current path

import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if we are currently inside any /admin route
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <html lang="en">
      <body>
        {/* Only show Public Navbar if NOT an admin page */}
        {!isAdminPage && <Navbar />}

        <main>{children}</main>

        {/* Only show Public Footer & WhatsApp if NOT an admin page */}
        {!isAdminPage && (
          <>
            <Footer />
            <WhatsAppButton />
          </>
        )}
      </body>
    </html>
  );
}