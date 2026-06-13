"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __TRAFFIX_DISABLE_PWA__?: boolean;
  }
}

export default function PWARegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (window.__TRAFFIX_DISABLE_PWA__) return;

    const unregisterDevelopmentWorkers = async () => {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));

        if ("caches" in window) {
          const cacheKeys = await caches.keys();
          await Promise.all(
            cacheKeys
              .filter((key) => key.startsWith("traffix-pwa"))
              .map((key) => caches.delete(key))
          );
        }
      } catch (error) {
        console.error("Failed to clear development service workers:", error);
      }
    };

    const register = async () => {
      try {
        if (process.env.NODE_ENV !== "production") {
          await unregisterDevelopmentWorkers();
          return;
        }

        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        registration.update().catch(() => {});
      } catch (error) {
        console.error("PWA service worker registration failed:", error);
      }
    };

    register();
  }, []);

  return null;
}
