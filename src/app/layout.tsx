import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ToasterProvider from "@/components/shared/ToasterProvider";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "TutorLagbe",
  description: "Modern Tuition Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Applying the font variable and antialiasing for crisp text */}
      <body className={`${geist.variable} font-sans antialiased`}>
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
