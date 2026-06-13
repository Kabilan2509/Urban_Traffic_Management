"use client";

import dynamic from "next/dynamic";

const TnTrafficPortal = dynamic(() => import("./TnTrafficPortal"), {
  ssr: false,
});

export default function PortalClientPage() {
  return <TnTrafficPortal />;
}
