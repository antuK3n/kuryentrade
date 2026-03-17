"use client"

import { useState } from "react"
import { 
  Search, 
  SlidersHorizontal, 
  Zap, 
  DollarSign, 
  Users, 
  TrendingUp,
  Star,
  ArrowUpRight,
  ChevronDown
} from "lucide-react"

const stats = [
  { label: "Available Energy", value: "114.0", unit: "kWh", icon: Zap },
  { label: "Avg Price", value: "2.5", unit: "ECT", icon: DollarSign },
  { label: "Active Sellers", value: "32", icon: Users },
  { label: "Market Trend", value: "+8.3%", icon: TrendingUp },
]

const sellers = [
  { address: "0x5F2A...8B84", location: "Quezon City, Manila", amount: "15.5 kWh", price: "2.4 ECT", rating: 4.8, status: "Available" },
  { address: "0x5F2A...8B84", location: "Quezon City, Manila", amount: "15.5 kWh", price: "2.4 ECT", rating: 4.8, status: "Available" },
  { address: "0x5F2A...8B84", location: "Quezon City, Manila", amount: "15.5 kWh", price: "2.4 ECT", rating: 4.8, status: "Available" },
  { address: "0x5F2A...8B84", location: "Quezon City, Manila", amount: "15.5 kWh", price: "2.4 ECT", rating: 4.8, status: "Available" },
  { address: "0x5F2A...8B84", location: "Quezon City, Manila", amount: "15.5 kWh", price: "2.4 ECT", rating: 4.8, status: "Available" },
  { address: "0x5F2A...8B84", location: "Quezon City, Manila", amount: "15.5 kWh", price: "2.4 ECT", rating: 4.8, status: "Available" },
]

export function MarketplaceContent() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy")
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header - RESTORED ORIGINAL FONTS */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Energy Marketplace</h1>
        <p className="text-muted-foreground mt-1">Buy and sell solar energy with your neighbors</p>
      </div>

      {/* Tabs and Search - RESTORED ORIGINAL FONTS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("buy")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "buy" 
                ? "bg-primary text-primary-foreground" 
                : "bg-[#0d2920] text-muted-foreground hover:text-foreground"
            }`}
          >
            Buy Energy
          </button>
          <button
            onClick={() => setActiveTab("sell")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "sell" 
                ? "bg-primary text-primary-foreground" 
                : "bg-[#0d2920] text-muted-foreground hover:text-foreground"
            }`}
          >
            Sell Energy
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={activeTab === "buy" ? "Search sellers..." : "Search buyers..."}
              className="w-full bg-[#0d2920] border border-primary/30 rounded-lg pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0d2920] border border-primary/30 rounded-lg hover:border-primary/50 transition-all"
          >
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium">Filters</span>
          </button>
        </div>
      </div>

      {/* Filters Panel - RESTORED ORIGINAL FONTS */}
      {showFilters && (
        <div className="bg-[#0d2920] border border-primary/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Filters</h3>
            <button className="text-sm text-primary hover:underline">Reset Filters</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Price Range (ECT)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="0"
                  className="w-full bg-[#0a1f1a] border border-primary/30 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                />
                <span className="text-muted-foreground">to</span>
                <input
                  type="number"
                  placeholder="6"
                  className="w-full bg-[#0a1f1a] border border-primary/30 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Minimum Rating</label>
              <div className="relative">
                <button className="w-full flex items-center justify-between bg-[#0a1f1a] border border-primary/30 rounded-lg px-3 py-2 text-foreground">
                  <span>1+ Stars</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards - RESTORED ORIGINAL FONTS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-[#0d2920] border border-primary/30 rounded-xl p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold text-foreground">
                {stat.value}
                {stat.unit && <span className="text-sm text-muted-foreground ml-1">{stat.unit}</span>}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Seller Cards Grid - RESTORED ORIGINAL FONTS & DYNAMIC BUTTON */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sellers.map((seller, index) => (
          <div 
            key={index}
            className="bg-[#0d2920] border border-primary/30 rounded-xl p-5 hover:border-primary/50 transition-all"
          >
            {/* Seller Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">
                    {seller.address.charAt(2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-mono text-sm text-foreground">{seller.address}</p>
                  <p className="text-xs text-muted-foreground">{seller.location}</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                {seller.status}
              </span>
            </div>

            {/* Seller Details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="font-semibold text-foreground">{seller.amount}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="font-semibold text-primary">{seller.price}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(seller.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} 
                />
              ))}
              <span className="text-sm text-muted-foreground ml-1">{seller.rating}</span>
            </div>

            {/* Dynamic Action Button */}
            <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-all">
              {activeTab === "buy" ? "Buy Now" : "List Energy"}
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}