import MainLayout from "@/components/layout/MainLayout";
import BottomNav from "@/components/layout/BottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Removed lg:w-9/12 and lg:mx-auto here so the grid isn't squeezed on medium/small laptops
    <div className="w-full relative min-h-screen">
      {/* MainLayout handles Sidebar (Left), Content (Center), and RightPanel (Right) */}
      <MainLayout>
        {children}
      </MainLayout>

      {/* BottomNav handles the mobile navigation bar */}
      <BottomNav />
    </div>
  );
}