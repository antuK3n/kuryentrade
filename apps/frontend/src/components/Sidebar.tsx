"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWeb3 } from "@/lib/Web3Context";
import { DEMO_WALLETS } from "@/lib/contracts";

const userNavItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: "View Request",
    href: "/request",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: "Send Request",
    href: "/send-request",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
  },
  {
    name: "Controller",
    href: "/controller",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

const adminNavItems = [
  {
    name: "Admin Panel",
    href: "/admin",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { account } = useWeb3();

  // Check if connected wallet is admin
  const isAdmin = account?.toLowerCase() === DEMO_WALLETS.admin.address.toLowerCase();

  return (
    <aside className="fixed left-0 top-[72px] w-[280px] h-[calc(100vh-72px)] bg-[#C8E6C9] py-8 px-4 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
      <nav className="space-y-2">
        {/* User Navigation */}
        {userNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                isActive
                  ? "bg-[#349552] text-white"
                  : "text-[#349552] hover:bg-[#B8D6B9]"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* Admin Section - Only visible to admin wallet */}
        {isAdmin && (
          <>
            <div className="my-4 border-t border-[#A8C9B8]" />
            <div className="text-xs font-semibold text-[#266433] px-4 mb-2 uppercase tracking-wide">
              Admin
            </div>
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive
                      ? "bg-[#266433] text-white"
                      : "text-[#266433] hover:bg-[#B8D6B9]"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </>
        )}

        {/* Wallet Info */}
        {account && (
          <>
            <div className="my-4 border-t border-[#A8C9B8]" />
            <div className="px-4 py-3 bg-white/50 rounded-lg">
              <div className="text-xs text-[#6B7C75] mb-1">Connected as</div>
              <div className="text-sm font-semibold text-[#266433]">
                {isAdmin ? "Admin" : "User"}
              </div>
              <div className="text-xs font-mono text-[#6B7C75] truncate">
                {account.slice(0, 10)}...{account.slice(-8)}
              </div>
            </div>
          </>
        )}
      </nav>
    </aside>
  );
}
