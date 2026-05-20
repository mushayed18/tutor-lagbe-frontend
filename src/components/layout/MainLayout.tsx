import Sidebar from "./Sidebar";
import RightPanel from "./RightPanel";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    // 1. Root container handles background color across the entire display monitor width
    <div className="w-full min-h-screen bg-background text-text-main">
      
      {/* 2. Unified Responsive Container Rule Stack:
           - px-0 md:px-4: Full edge-to-edge on mobile, cozy breathing room on laptops.
           - w-full lg:w-11/12 xl:w-full: Stretches fully on small/medium screens, takes 11/12 on large laptops so it doesn't look squished.
           - max-w-[1250px] mx-auto: Freezes the layout completely when zooming out past 1250px.
      */}
      <div className="w-full lg:w-11/12 xl:w-full max-w-312.5 mx-auto flex min-h-screen px-0 md:px-4">
        
        {/* LEFT SIDEBAR (Sticky Navigation) */}
        <Sidebar />

        {/* CENTER CONTENT (The Scrollable Feed) */}
        <main className="flex-1 min-w-0">
          <div className="w-full h-full">
            {children}
          </div>
        </main>

        {/* RIGHT PANEL (Subscription & CTA) */}
        <RightPanel />

      </div>
    </div>
  );
}