import type { Metadata } from "next";
import { Inter, Jersey_25 } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/lib/Web3Context";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jersey25 = Jersey_25({
  variable: "--font-jersey",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KuryenTrade - P2P Energy Trading",
  description: "Trade renewable energy credits in your neighborhood grid",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jersey25.variable} antialiased bg-[#F5F7F6] min-h-screen`}>
        <Web3Provider>
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-[280px] mt-[72px] min-h-[calc(100vh-72px)]">
              {children}
            </main>
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
