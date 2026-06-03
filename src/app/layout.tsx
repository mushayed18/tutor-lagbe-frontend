import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ToasterProvider from "@/components/shared/ToasterProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { NotificationProvider } from "@/providers/NotificationProvider";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "TutorLagbe | Find the Best Tutors & Tuition Online",
  description: "Modern Tuition Marketplace connecting expert tutors with parents and students instantly.",
  verification: {
    google: "l2__SugeZAYbnZe5TymZLsH00nBnfQHJ3alZO1KHC1E", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      {/* Added bg-background and text-text-main to prevent white flashes */}
      <body
        className={`${geist.variable} font-sans antialiased bg-background text-text-main`}
      >
        <AuthProvider>
          <NotificationProvider>
            <ToasterProvider />
            {children}
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
