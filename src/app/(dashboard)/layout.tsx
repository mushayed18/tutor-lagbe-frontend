import MainLayout from "@/components/layout/MainLayout";
import BottomNav from "@/components/layout/BottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-8/12 mx-auto relative min-h-screen">
      {/* MainLayout handles Sidebar (Left), Content (Center), and RightPanel (Right) */}
      <MainLayout>
        {children}
      </MainLayout>

      {/* BottomNav handles the mobile navigation bar */}
      <BottomNav />
    </div>
  );
}