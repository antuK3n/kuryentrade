"use client";

import Link from "next/link";
import { useWeb3 } from "@/lib/Web3Context";

export default function Header() {
  const { account, ectBalance, isConnecting, connect, disconnect } = useWeb3();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#266433] text-white h-[72px]">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <svg width="40" height="42" viewBox="0 0 51 53" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 10C0 4.47715 4.47715 0 10 0H41C46.5228 0 51 4.47715 51 10V43C51 48.5229 46.5228 53 41 53H10C4.47715 53 0 48.5228 0 43V10Z" fill="white"/>
            <path d="M17.5 28.5C17.3108 28.5006 17.1252 28.4476 16.9649 28.347C16.8047 28.2464 16.6762 28.1024 16.5945 27.9317C16.5129 27.761 16.4813 27.5706 16.5035 27.3827C16.5257 27.1947 16.6008 27.017 16.72 26.87L26.62 16.67C26.6943 16.5843 26.7955 16.5264 26.907 16.5057C27.0185 16.4851 27.1337 16.503 27.2337 16.5565C27.3337 16.61 27.4126 16.6959 27.4573 16.8001C27.5021 16.9043 27.5101 17.0206 27.48 17.13L25.56 23.15C25.5034 23.3015 25.4844 23.4645 25.5046 23.625C25.5248 23.7855 25.5837 23.9387 25.6761 24.0714C25.7685 24.2042 25.8918 24.3125 26.0353 24.3872C26.1788 24.4618 26.3382 24.5005 26.5 24.5H33.5C33.6892 24.4994 33.8748 24.5524 34.035 24.653C34.1953 24.7536 34.3238 24.8976 34.4054 25.0683C34.4871 25.239 34.5187 25.4294 34.4965 25.6173C34.4743 25.8053 34.3992 25.983 34.28 26.13L24.38 36.33C24.3057 36.4157 24.2045 36.4736 24.093 36.4943C23.9815 36.5149 23.8663 36.497 23.7663 36.4435C23.6663 36.39 23.5874 36.3041 23.5427 36.1999C23.4979 36.0957 23.4899 35.9793 23.52 35.87L25.44 29.85C25.4966 29.6985 25.5156 29.5355 25.4954 29.375C25.4752 29.2145 25.4163 29.0613 25.3239 28.9286C25.2315 28.7958 25.1082 28.6875 24.9647 28.6128C24.8212 28.5382 24.6617 28.4995 24.5 28.5H17.5Z" stroke="#349552" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <span className="font-jersey text-2xl font-normal tracking-wide">KuryenTrade</span>
            <div className="text-xs text-white/80 -mt-1">Energy Trading Platform</div>
          </div>
        </Link>

        {/* Right side - User info */}
        <div className="flex items-center gap-4">
          {account ? (
            <div className="flex items-center gap-3 cursor-pointer" onClick={disconnect}>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#349552]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <span className="font-semibold text-lg">
                Balance: {parseFloat(ectBalance).toFixed(0)} ETC
              </span>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#349552]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <span className="font-semibold text-lg">
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
