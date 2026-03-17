"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Store, 
  Wallet, 
  Map, 
  Cpu, 
  History, 
  LogOut,
  Bell
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/marketplace", label: "Marketplace", icon: Store },
  { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { href: "/dashboard/map", label: "Community Map", icon: Map },
  { href: "/dashboard/systems", label: "My Systems", icon: Cpu },
  { href: "/dashboard/history", label: "Transaction History", icon: History },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#06120D] flex flex-col font-sans">
      
      {/* 1. SINGLE TOP HEADER (Figma Style) */}
      <header className="h-20 bg-[#06120D] border-b border-[#1A3324] flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/Logo.png" 
            alt="KuryenTrade"
            width={200}
            height={50}
            className="h-10 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-6">
          <button className="relative p-2 text-[#22C55E] hover:bg-[#22C55E]/10 rounded-full transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#22C55E] rounded-full border-2 border-[#06120D]"></span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 bg-[#0D2920] border border-[#1A3324] rounded-full px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E]" />
              <span className="text-sm text-white font-mono uppercase tracking-wider">0x1234...ABCD</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#22C55E] flex items-center justify-center text-[#06120D] font-extrabold text-lg shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              M
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 2. SIDEBAR */}
        <aside className="w-64 bg-[#06120D] border-r border-[#1A3324] hidden md:flex flex-col z-20">
          <nav className="flex-1 p-4 pt-8 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-[#22C55E] text-[#06120D] font-bold shadow-[0_4px_20px_rgba(34,197,94,0.2)]"
                      : "text-[#22C55E] hover:bg-[#22C55E]/10 font-medium"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout & Status Area */}
          <div className="p-4 border-t border-[#1A3324]">
            <Link href="/login" className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl bg-[#22C55E] text-[#06120D] font-bold hover:bg-white transition-all shadow-lg mb-6">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Link>

            <div className="px-2">
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">Network Status</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse shadow-[0_0_5px_#22C55E]" />
                <span className="text-xs text-[#22C55E] font-medium">Connected to Moonbeam</span>
              </div>
            </div>
          </div>
        </aside>

        {/* 3. MAIN CONTENT */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-[#06120D]">
          <main className="p-8 lg:p-10 flex-1">
            {children}
          </main>

          <footer className="py-6 text-center border-t border-[#1A3324]">
            <p className="text-xs text-[#22C55E]/50 font-medium">
              © 2026 KuryenTrade • Energy Trading Platform
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}