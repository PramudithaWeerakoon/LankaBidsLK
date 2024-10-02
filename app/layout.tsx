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

  // Check if the current route is '/Login'
  const isLoginPage = pathname === '/Login';

  return (
    <html lang="en">
      <body className={geistSans.className}>
        {!isLoginPage && <Header roleID={roleID} isLoggedIn={isLoggedIn} />}
        <main>{children}</main>

        
         {/* Include the Footer component */}
      {!isLoginPage && <Footer />}
        
      </body>
     

    </html>
  );
};

export default Layout;
