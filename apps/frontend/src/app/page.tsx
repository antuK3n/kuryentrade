import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#06120D] font-sans overflow-x-hidden">
      
      {/* BACKGROUND 1: Top Solar Panels - Unified Opacity and Gradient */}
      <div className="absolute top-0 left-0 w-full h-[90vh] z-0">
         <Image 
           src="/images/Log-In-Bg.png" 
           alt="Solar panels at sunset" 
           fill 
           className="object-cover opacity-60 mix-blend-screen" 
           priority
         />
         <div className="absolute inset-0 bg-gradient-to-b from-[#06120D]/40 via-[#06120D]/80 to-[#06120D]"></div>
      </div>

      {/* CONTENT WRAPPER */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 pt-10 pb-24">
         
         {/* HEADER: Top Logo & Auth Buttons */}
         <header className="relative w-full flex justify-between items-center -mt-2 -ml-2 mb-10 md:mb-12">
           {/* Left: Logo */}
           <Link href="/" className="relative block w-72 h-20 md:w-96 md:h-28">
             <Image 
               src="/images/Logo.png" 
               alt="KuryenTrade" 
               fill 
               className="object-contain object-left" 
               priority
             />
           </Link>

           {/* Right: Auth Buttons - Colors Aligned with Dashboard */}
           <div className="flex items-center gap-5 md:gap-8">
              <Link href="/login" className="text-[#22C55E] hover:text-white font-medium transition-colors text-base md:text-lg">
                Sign In
              </Link>
              <Link href="/signup" className="bg-[#22C55E] text-[#06120D] font-bold py-2.5 px-6 md:py-3 md:px-7 rounded-xl hover:bg-[#22C55E]/90 transition shadow-[0_0_15px_rgba(34,197,94,0.3)] text-sm md:text-base">
                Get Started
              </Link>
           </div>
         </header>

         {/* Hero Section */}
         <section className="max-w-2xl mb-40">
            <div className="relative w-full h-32 md:h-40 mb-6">
              <Image 
                src="/images/Trade Renewable Energy with Blockchain@2x.png" 
                alt="Trade Renewable Energy with Blockchain" 
                fill 
                className="object-contain object-left" 
              />
            </div>
            
            <p className="text-[#8B9F93] text-base md:text-lg mb-10 leading-relaxed max-w-xl">
              KuryenTrade is a decentralized energy trading platform that allows users to buy and sell renewable energy securely using blockchain technology.
            </p>
            
            <div className="flex flex-wrap gap-5">
              <Link href="/dashboard/wallet" className="bg-[#22C55E] text-[#06120D] font-bold py-3 px-8 rounded-lg hover:bg-[#22C55E]/90 transition shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                Connect Wallet
              </Link>
              <Link href="/dashboard/marketplace" className="bg-[#06120D]/50 backdrop-blur-sm border border-[#22C55E] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#22C55E]/10 transition">
                Explore Marketplace
              </Link>
            </div>
         </section>

         {/* How It Works Section - Borders Fixed to match Dashboard */}
         <section className="text-center mb-25 mt-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-widest uppercase">HOW IT WORKS</h2>
            <p className="text-[#8B9F93] mb-40 text-sm md:text-base">Here's how KuryenTrade turns your solar energy into tradeable digital credits</p>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 px-2 md:px-6 mt-24 md:mt-28">               
               
               {/* Step 1 */}
               <div className="relative flex flex-col items-center group mt-36 md:mt-0">
                  <div className="absolute -top-40 md:-top-48 lg:-top-56 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] md:w-[35rem] md:h-[35rem] lg:w-[45rem] lg:h-[30rem] z-20 drop-shadow-[0_15px_30px_rgba(34,197,94,0.3)] transition-transform duration-500 group-hover:-translate-y-4">
                     <Image src="/images/kt1.png" alt="Connect Wallet Icon" fill className="object-contain" priority />
                  </div>
                  <div className="bg-gradient-to-b from-[#0d2920]/60 to-[#06120D]/95 backdrop-blur-md border border-[#22C55E]/20 rounded-[2.5rem] pt-36 md:pt-44 pb-10 px-6 w-full shadow-2xl relative z-10 group-hover:border-[#22C55E]/50 transition duration-300">
                     <h3 className="text-white font-bold text-xl mb-3">1. Connect Wallet</h3>
                     <p className="text-[#8B9F93] text-sm leading-relaxed">Securely link your crypto wallet to access the platform with ease</p>
                  </div>
               </div>

               {/* Step 2 */}
               <div className="relative flex flex-col items-center group mt-36 md:mt-0">
                  <div className="absolute -top-40 md:-top-48 lg:-top-56 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] md:w-[35rem] md:h-[35rem] lg:w-[45rem] lg:h-[30rem] z-20 drop-shadow-[0_15px_30px_rgba(34,197,94,0.3)] transition-transform duration-500 group-hover:-translate-y-4">
                     <Image src="/images/kt2.png" alt="Trade Energy Icon" fill className="object-contain" priority />
                  </div>
                  <div className="bg-gradient-to-b from-[#0d2920]/60 to-[#06120D]/95 backdrop-blur-md border border-[#22C55E]/20 rounded-[2.5rem] pt-36 md:pt-44 pb-10 px-6 w-full shadow-2xl relative z-10 group-hover:border-[#22C55E]/50 transition duration-300">
                     <h3 className="text-white font-bold text-xl mb-3">2. Trade Energy</h3>
                     <p className="text-[#8B9F93] text-sm leading-relaxed">Buy or Sell renewable energy with other users through the marketplace</p>
                  </div>
               </div>

               {/* Step 3 */}
               <div className="relative flex flex-col items-center group mt-36 md:mt-0">
                  <div className="absolute -top-40 md:-top-48 lg:-top-56 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] md:w-[35rem] md:h-[35rem] lg:w-[50rem] lg:h-[30rem] z-20 drop-shadow-[0_15px_30px_rgba(34,197,94,0.3)] transition-transform duration-500 group-hover:-translate-y-4">
                     <Image src="/images/kt3.png" alt="Track Transactions Icon" fill className="object-contain" priority />
                  </div>
                  <div className="bg-gradient-to-b from-[#0d2920]/60 to-[#06120D]/95 backdrop-blur-md border border-[#22C55E]/20 rounded-[2.5rem] pt-36 md:pt-44 pb-10 px-6 w-full shadow-2xl relative z-10 group-hover:border-[#22C55E]/50 transition duration-300">
                     <h3 className="text-white font-bold text-xl mb-3">3. Track Transactions</h3>
                     <p className="text-[#8B9F93] text-sm leading-relaxed">Monitor your trades, wallet balance, and energy usage in real time</p>
                  </div>
               </div>

            </div>
         </section>
      </div>

      {/* FOOTER & CTA SECTION - Updated Gradients */}
      <div className="relative w-full min-h-[50vh] flex flex-col items-center justify-between pt-12 pb-10 border-t border-[#22C55E]/20 mt-0 md:-mt-8"> 
         <Image 
           src="/images/foreman-businessman-solar-energy-station.jpg" 
           alt="Engineers at solar station" 
           fill 
           className="object-cover opacity-30 z-0" 
         />
         <div className="absolute inset-0 bg-gradient-to-t from-[#06120D] via-[#06120D]/50 to-[#06120D] z-0"></div>
         
         {/* Call To Action Content */}
         <div className="relative z-10 flex flex-col items-center text-center px-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
              Ready to Start Trading Renewable Energy?
            </h2>
            <p className="text-[#22C55E] text-base md:text-lg mb-8 font-medium">
              Join thousands of users who are already trading energy on our platform.
            </p>
            <Link href="/signup" className="bg-[#22C55E] text-[#06120D] font-bold py-3.5 px-10 rounded-xl hover:bg-white transition shadow-[0_0_20px_rgba(34,197,94,0.3)] text-lg">
              Create Your Account
            </Link>
         </div>

         {/* Footer Content */}
         <div className="relative z-10 flex flex-col items-center space-y-3 mt-auto">
            <h3 className="text-[#22C55E] font-bold text-base md:text-lg italic tracking-wide">
              Polytechnic University of the Philippines, Manila
            </h3>
            <p className="text-sm text-[#22C55E]/60 tracking-widest font-bold uppercase">
               © 2026 KuryenTrade • Energy Trading Platform
            </p>
         </div>
      </div>
    </div>     
  );
}