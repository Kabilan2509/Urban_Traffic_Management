import type { Metadata, Viewport } from "next";
import "./globals.css";
import React from "react";
import PWARegistrar from "@/components/PWARegistrar";

export const metadata: Metadata = {
  title: "Traffix Portal v4.0 | Government Smart Traffic Command Platform",
  description: "Production-grade AI-Powered Smart Traffic Management and Predictive Traffic Intelligence System for Tamil Nadu. Real-time junction control, LSTM predictions, emergency corridors, sensor management, and RBAC.",
  keywords: "smart traffic, AI traffic management, government traffic portal, Tamil Nadu traffic, LSTM prediction, emergency corridors",
  manifest: "/manifest.webmanifest",
  applicationName: "Traffix Portal",
  icons: {
    icon: [
      { url: "/pwa-192.svg", type: "image/svg+xml" },
      { url: "/pwa-512.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/pwa-192.svg", type: "image/svg+xml" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Traffix Portal",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0F4C75",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Initialize theme immediately to prevent flash */}
        <script dangerouslySetInnerHTML={{__html: `
          const themeKey = 'traffix-theme-preference';
          const darkClass = 'dark-mode';
          const saved = localStorage.getItem(themeKey);
          const dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (dark) document.documentElement.classList.add(darkClass);
        `}} suppressHydrationWarning/>
        <script dangerouslySetInnerHTML={{__html: `
          (function () {
            const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
            if (!isLocalHost || !("serviceWorker" in navigator)) return;

            window.__TRAFFIX_DISABLE_PWA__ = true;

            navigator.serviceWorker.getRegistrations()
              .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
              .catch(() => {});

            if ("caches" in window) {
              caches.keys()
                .then((keys) => Promise.all(keys.filter((key) => key.startsWith("traffix-pwa")).map((key) => caches.delete(key))))
                .catch(() => {});
            }
          })();
        `}} suppressHydrationWarning/>
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'Inter', 'Outfit', sans-serif" }}>
        <PWARegistrar />
        {children}
      </body>
    </html>
  );
}
