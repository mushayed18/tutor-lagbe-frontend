import Sidebar from "./Sidebar";
import RightPanel from "./RightPanel";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-text-main">
      {/* 1. LEFT SIDEBAR (Sticky Navigation) */}
      <Sidebar />

      {/* 2. CENTER CONTENT (The Scrollable Feed) */}
      <main className="flex-1 border-r border-border min-w-0">
        {/* 
            On Mobile, this will take 100% width.
            On Desktop, it is bounded by the two sidebars.
        */}
        <div className="max-w-2xl mx-auto lg:mx-0 xl:max-w-3xl">
          {children}
        </div>
      </main>

      {/* 3. RIGHT PANEL (Subscription & CTA)[cite: 1] */}
      <RightPanel />
    </div>
  );
}