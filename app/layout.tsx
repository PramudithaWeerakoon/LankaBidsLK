"use client"; // Add this directive at the top

import React, { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/header/header"; // Adjust the import if necessary
import Footer from "@/components/footer/Footer"; // Import the Footer component

const geistSans = localFont({
  src: "../components/fonts/GeistVF.woff",
  weight: "100 900",
});

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [roleID, setRoleID] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const storedRoleID = localStorage.getItem("RoleID");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (storedRoleID) {
      setRoleID(parseInt(storedRoleID, 10));
    }
    setIsLoggedIn(storedIsLoggedIn);
  }, []);

  const isAuthPage = pathname === '/Login' || pathname.startsWith('/auth');

  return (
    <html lang="en">
      <body className={geistSans.className} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {!isAuthPage && <Header roleID={roleID} isLoggedIn={isLoggedIn} />}
        <main style={{ flex: 1 }}>
          {children}
        </main>
        {!isAuthPage && <Footer />}
      </body>
    </html>
  );
};

export default Layout;