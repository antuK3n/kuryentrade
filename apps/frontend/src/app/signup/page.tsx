import Image from "next/image";
import Link from "next/link";
import { Wallet, Check } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen relative flex flex-col justify-between p-6 bg-[#07130C] overflow-hidden font-sans">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/image-24.png"
          alt="Solar Background"
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07130C] via-[#07130C]/80 to-[#07130C]/40"></div>
      </div>

      {/* TOP LOGO - Made even larger! */}
      <div className="relative z-10 w-full flex justify-start -mt-2 -ml-2 md:-ml-0">
        {/* Increased width (w) and height (h) classes here */}
        <Link href="/" className="relative block w-72 h-20 md:w-96 md:h-28">
          <Image 
            src="/images/Logo.png" 
            alt="KuryenTrade" 
            fill 
            className="object-contain object-left" 
            priority
          />
        </Link>
      </div>

      {/* MAIN CONTENT - GLOWING CARD */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full max-w-4xl mx-auto my-8">
         {/* Card Background */}
         <div className="w-full bg-[#0A1C12]/95 backdrop-blur-xl rounded-3xl border border-[#1A4B2E]/60 shadow-[0_0_40px_rgba(34,197,94,0.1)] overflow-hidden flex flex-col md:flex-row">

            {/* LEFT SIDE: FORM */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-[#22C55E] mb-2">Create an account</h2>
                    <p className="text-white font-medium text-sm">Create your KuryenTrade account</p>
                </div>

                <form className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-white ml-1">Name</label>
                        <input type="text" placeholder="Enter your name" className="w-full bg-[#133A24] border border-[#1A4B2E] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#4A8A63] transition-colors outline-none" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-white ml-1">Email</label>
                        <input type="email" placeholder="Enter your email" className="w-full bg-[#133A24] border border-[#1A4B2E] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#4A8A63] transition-colors outline-none" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-white ml-1">Password</label>
                        <input type="password" placeholder="Create a password" className="w-full bg-[#133A24] border border-[#1A4B2E] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#4A8A63] transition-colors outline-none" />
                        <p className="text-[#22C55E] text-[11px] font-bold ml-1 pt-1">Must be at least 8 characters.</p>
                    </div>

                    <Link href="/dashboard" className="w-full flex items-center justify-center bg-[#22C55E] hover:bg-[#22C55E]/90 text-[#0A1C12] font-bold py-3.5 rounded-xl text-base transition-colors mt-2">
                        Create Account
                    </Link>
                </form>

                <div className="flex items-center my-5">
                    <div className="flex-1 border-t border-[#1A4B2E]"></div>
                    <span className="px-4 text-xs font-bold text-[#22C55E]">or</span>
                    <div className="flex-1 border-t border-[#1A4B2E]"></div>
                </div>

                <div className="space-y-3">
                    <button type="button" className="w-full bg-[#133A24] hover:bg-[#1A4B2E] text-[#22C55E] font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors border border-[#1A4B2E]">
                        <Wallet className="w-5 h-5" />
                        Connect Wallet
                    </button>
                    <button type="button" className="w-full bg-[#133A24] hover:bg-[#1A4B2E] text-[#22C55E] font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors border border-[#1A4B2E]">
                        <svg className="w-5 h-5 text-[#22C55E]" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                        Sign in with Google
                    </button>
                </div>

                <p className="text-center text-xs text-white mt-6 font-medium">
                    Already have an account? <Link href="/login" className="text-[#22C55E] font-bold hover:underline">Sign In</Link>
                </p>
            </div>

            {/* RIGHT SIDE: STATIC IMAGE BANNER */}
            <div className="hidden md:block w-1/2 relative p-3">
                <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-inner border border-[#1A4B2E]">
                    <Image src="/images/image-27.jpg" alt="Solar facility" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0A1C12]/80 via-[#0A1C12]/40 to-[#0A1C12]/90"></div>
                    <div className="absolute inset-0 p-8 flex flex-col justify-between">
                        <div className="mt-4">
                            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-2 leading-tight">Let's get you started!</h2>
                            <p className="text-gray-200 text-sm max-w-[280px] leading-relaxed mb-8">Start trading renewable energy securely and easily.</p>
                            
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-sm text-white font-medium">
                                    <Check className="w-5 h-5 text-[#22C55E]" /> Buy and Sell renewable energy
                                </li>
                                <li className="flex items-center gap-3 text-sm text-white font-medium">
                                    <Check className="w-5 h-5 text-[#22C55E]" /> Secure transactions with blockchain
                                </li>
                                <li className="flex items-center gap-3 text-sm text-white font-medium">
                                    <Check className="w-5 h-5 text-[#22C55E]" /> Track trades and energy balance
                                </li>
                            </ul>
                        </div>
                        
                        {/* THE NEW "NOT BORING" WIDGET (No Dots) */}
                        <div className="flex items-center justify-end mt-auto">
                            {/* Floating Glassmorphic Status Badge */}
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl py-2 px-4 flex items-center gap-3 shadow-2xl">
                                <div className="relative flex h-2.5 w-2.5">
                                  {/* Pulsing animation */}
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22C55E]"></span>
                                </div>
                                <div>
                                  <p className="text-white/60 text-[9px] uppercase tracking-widest font-bold mb-0.5">Network Status</p>
                                  <p className="text-white text-xs font-bold">12,450 Nodes Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

         </div>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center pb-2 text-center space-y-5">
         <h3 className="text-[#22C55E] font-bold text-lg tracking-wide">Polytechnic University of the Philippines, Manila</h3>
         
         <div className="w-full max-w-4xl border-t border-[#1A4B2E]"></div>
         
         <div className="flex items-center gap-6 text-[#22C55E]">
            <svg className="w-6 h-6 hover:text-white transition cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <svg className="w-6 h-6 hover:text-white transition cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            <svg className="w-5 h-5 hover:text-white transition cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
            <svg className="w-6 h-6 hover:text-white transition cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
         </div>
         
         <p className="text-sm text-[#22C55E]/60 tracking-wide font-medium">
            © 2026 KuryenTrade • Energy Trading Platform
         </p>
      </div>
    </div>
  );
}