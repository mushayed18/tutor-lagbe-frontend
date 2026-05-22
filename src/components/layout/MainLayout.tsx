"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import RightPanel from "./RightPanel";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Dynamically flag if the client is browsing an administrative dashboard view
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    // 1. Root container handles background color across the entire display monitor width
    <div className="w-full min-h-screen bg-background text-text-main">
      {/* 2. Unified Responsive Container Rule Stack:
           - max-w-6xl for admins allows wide density charts, max-w-[1250px] for feed profiles.
      */}
      <div
        className={`w-full lg:w-11/12 xl:w-full mx-auto flex min-h-screen px-0 md:px-4 ${
          isAdminRoute ? "max-w-6xl" : "max-w-312.5"
        }`}
      >
        {/* LEFT SIDEBAR (Sticky Navigation) */}
        <Sidebar />

        {/* CENTER CONTENT (The Scrollable Feed / Main Admin Tables View) */}
        <main className="flex-1 min-w-0">
          <div className="w-full h-full">{children}</div>
        </main>

        {/* RIGHT PANEL (Subscription & CTA - Hidden completely on Admin Routes) */}
        {!isAdminRoute && <RightPanel />}
      </div>
    </div>
  );
}
