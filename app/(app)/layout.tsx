import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar/Navbar";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
const inter = Inter({ subsets: ["latin"] });
const pippins = Poppins({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] });

export const metadata = {
  title: 'AnnoFeed',
  description: 'Get your true feedback from annonymous people',
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={pippins.className}>
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
