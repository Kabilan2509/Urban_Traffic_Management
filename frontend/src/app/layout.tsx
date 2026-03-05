import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import React from "react";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Traffix | AI-Powered Smart Traffic Management Platform",
  description: "Advanced traffic monitoring, prediction, and signal optimization system for city traffic authorities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} bg-slate-900 text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
