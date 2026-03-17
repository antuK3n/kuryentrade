"use client"

import { 
  DollarSign, 
  Zap, 
  Activity, 
  ArrowUpRight,
  Calendar,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Coins,
  ShoppingCart,
  MapPin
} from "lucide-react"

// ALL data arrays preserved
const statsCards = [
  { label: "ECT Balance", value: "342.45", change: "+12.5%", positive: true, icon: DollarSign },
  { label: "Today's Production", value: "28.7", unit: "kWh", change: "+15.2%", positive: true, icon: Zap },
  { label: "Current Output", value: "4.3", unit: "kWh", change: "+8.3%", positive: true, icon: Activity },
  { label: "Active Trades", value: "8", change: "+5.0%", positive: true, icon: Calendar },
]

const recentActivity = [
  { type: "mint", description: "Minted 12.4 ECT from solar production", time: "2 hours ago", amount: "+12.4", unit: "ECT" },
  { type: "sell", description: "Sold 8.5 ECT to 0x9C1D...F2A7", time: "5 hours ago", amount: "-8.5", unit: "ECT" },
  { type: "buy", description: "Purchased 15.0 ECT from Marketplace", time: "1 day ago", amount: "+15.0", unit: "ECT" },
]

const pendingRequests = [
  { address: "0x5F2A...8B84", location: "Quezon City", time: "10 min ago", amount: "15.5 kWh", price: "2.4 ECT/kWh" },
  { address: "0x9C1D...F2A7", location: "Makati", time: "1 hour ago", amount: "22 kWh", price: "2.6 ECT/kWh" },
  { address: "0x7A3C...2BC2", location: "Pasig City", time: "3 hours ago", amount: "10 kWh", price: "2.3 ECT/kWh" },
]

const quickActions = [
  { label: "Mint ECT", icon: Coins },
  { label: "Sell Energy", icon: TrendingUp },
  { label: "Buy Energy", icon: ShoppingCart },
  { label: "View Map", icon: MapPin },
]

const tradingData = {
  bought: [30, 52, 45, 60],
  sold: [20, 73, 35, 50],
  months: ["Jan", "Feb", "Mar", "Apr"]
}

export function DashboardContent() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* 1. Welcome Header */}
      <div className="space-y-1">
        <p className="text-[#22C55E] font-medium tracking-wide">Welcome Back!</p>
        <h1 className="text-4xl font-black text-white tracking-tight">Juan Dela Cruz!</h1>
        <p className="text-[#8B9F93] text-sm font-medium">{"Here's what's happening with your solar energy systems"}</p>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-[#0d2920] border border-[#22C55E]/30 rounded-xl p-6 hover:border-[#22C55E]/50 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-2.5 bg-[#22C55E]/10 rounded-lg text-[#22C55E] group-hover:scale-110 transition-transform">
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md ${stat.positive ? 'text-[#22C55E] bg-[#22C55E]/10' : 'text-red-400 bg-red-400/10'}`}>
                {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-[#8B9F93] text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-white tracking-tight">
              {stat.value} {stat.unit && <span className="text-sm font-black text-[#22C55E] ml-1">{stat.unit}</span>}
            </h3>
          </div>
        ))}
      </div>

      {/* 3. Visualizations (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Generation Chart (Wave SVG) */}
        <div className="bg-[#0d2920] border border-[#22C55E]/30 rounded-2xl p-8 flex flex-col h-[380px] relative overflow-hidden shadow-xl">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white tracking-tight">Today's Generation</h3>
            <p className="text-[#22C55E] text-sm font-medium">Real-time solar output</p>
          </div>
          <div className="flex-1 w-full relative mt-6">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
              <defs>
                <linearGradient id="wave-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,40 L0,32 Q15,22 30,28 T60,12 T90,24 L100,24 L100,40 Z" fill="url(#wave-grad)" />
              <path d="M0,32 Q15,22 30,28 T60,12 T90,24 L100,24" fill="none" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex justify-between text-[#22C55E] text-[10px] md:text-xs mt-6 font-black uppercase tracking-tighter opacity-60">
            {["6AM", "9AM", "12PM", "3PM", "6PM", "9PM", "12AM"].map(time => <span key={time}>{time}</span>)}
          </div>
        </div>

        {/* Trading Activity Chart (Side-by-Side Bars) */}
        <div className="bg-[#0d2920] border border-[#22C55E]/30 rounded-2xl p-8 flex flex-col h-[380px] shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Trading Activity</h3>
              <p className="text-[#22C55E] text-sm font-medium">Last 4 months</p>
            </div>
            <Calendar className="w-5 h-5 text-[#22C55E]/40" />
          </div>
          <div className="flex-1 flex items-end justify-around gap-4 px-2 mt-8">
            {tradingData.months.map((month, index) => (
              <div key={month} className="flex flex-col items-center flex-1 h-full">
                <div className="flex items-end gap-1.5 h-full w-full justify-center">
                  <div className="w-3 md:w-5 bg-[#22C55E] rounded-t-[2px] shadow-[0_0_10px_rgba(34,197,94,0.2)]" style={{ height: `${tradingData.bought[index]}%` }}></div>
                  <div className="w-3 md:w-5 bg-[#22C55E]/30 rounded-t-[2px]" style={{ height: `${tradingData.sold[index]}%` }}></div>
                </div>
                <span className="text-[#22C55E] text-[10px] md:text-xs font-black mt-4 uppercase tracking-widest">{month}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-8 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#22C55E] rounded-sm"></div>
              <span className="text-[10px] text-[#22C55E] font-bold uppercase tracking-wider">Bought</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#22C55E]/30 rounded-sm"></div>
              <span className="text-[10px] text-[#22C55E]/60 font-bold uppercase tracking-wider">Sold</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid - FIXED ALIGNMENT (item-stretch ensures equal height) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-[#0d2920] border border-[#22C55E]/30 rounded-xl p-8 shadow-xl flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white tracking-tight">Recent Activity</h3>
            <button className="text-[#22C55E] text-sm font-bold hover:underline underline-offset-4 decoration-2">View All</button>
          </div>
          <div className="space-y-4 flex-1">
            {recentActivity.map((activity, index) => (
              <div key={index} className="bg-[#0a1f1a] border border-[#22C55E]/10 p-5 rounded-xl flex items-center justify-between group hover:border-[#22C55E]/40 transition-all cursor-pointer">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    activity.type === 'mint' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 
                    activity.type === 'sell' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{activity.description}</p>
                    <p className="text-[#8B9F93] text-xs font-medium">{activity.time}</p>
                  </div>
                </div>
                <p className={`font-black text-sm ${activity.amount.startsWith('+') ? 'text-[#22C55E]' : 'text-red-400'}`}>
                  {activity.amount} <span className="opacity-50">{activity.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Container - Balanced spacing */}
        <div className="bg-[#0d2920] border border-[#22C55E]/30 rounded-xl p-8 shadow-xl flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Quick Actions</h3>
          <div className="space-y-3 flex-1 flex flex-col justify-start">
            {quickActions.map((action, index) => (
              <button key={index} className="w-full flex items-center justify-between p-4 bg-[#0a1f1a] rounded-xl border border-[#22C55E]/10 hover:border-[#22C55E]/50 hover:bg-[#22C55E]/5 transition-all group text-left">
                <div className="flex items-center gap-3">
                  <action.icon className="w-5 h-5 text-[#22C55E]" />
                  <span className="font-bold text-sm text-white">{action.label}</span>
                </div>
                <ExternalLink className="w-4 h-4 text-[#8B9F93] group-hover:text-[#22C55E] transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Pending Trade Requests */}
      <div className="bg-[#0d2920] border border-[#22C55E]/30 rounded-xl p-8 shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-white tracking-tight">Pending Trade Requests</h3>
          <button className="text-[#22C55E] text-sm font-bold flex items-center gap-1 hover:underline underline-offset-4 decoration-2">
            View All <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pendingRequests.map((request, index) => (
            <div key={index} className="bg-[#0a1f1a] border border-[#22C55E]/10 p-5 rounded-xl flex items-center justify-between group hover:border-[#22C55E]/40 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#22C55E] flex items-center justify-center text-[#0a1f1a] font-black text-sm shadow-lg">
                  {request.address.charAt(2).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-mono text-xs font-bold">{request.address}</p>
                  <p className="text-[#22C55E]/50 text-[10px] uppercase font-bold tracking-widest">{request.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-xs">{request.amount}</p>
                <p className="text-[#22C55E] font-black text-[10px]">{request.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}