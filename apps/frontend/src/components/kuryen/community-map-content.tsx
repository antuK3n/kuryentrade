"use client"

import { useState } from "react"
import { MapPin, X, Zap, TrendingUp } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import the real Leaflet map to prevent Next.js server crashes
const InteractiveMap = dynamic(() => import("./RealMap"), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#0c1411] flex items-center justify-center text-[#00D084]">Loading map engine...</div>
})

interface MapMarker {
  id: string
  walletAddress: string
  location: string
  lat: number
  lng: number
  currentOutput: number
  ectBalance: number
  energyGenerated: number
  percentChange: number
}

const placeholderMarkers: MapMarker[] = [
  {
    id: "1",
    walletAddress: "0x1234...ABCD",
    location: "Old Sta. Mesa",
    lat: 14.6042,
    lng: 121.0103,
    currentOutput: 4.3,
    ectBalance: 342.45,
    energyGenerated: 22.8,
    percentChange: 9.35,
  },
  {
    id: "2",
    walletAddress: "0x5F2A...B8E4",
    location: "Quezon City",
    lat: 14.6488,
    lng: 121.0509,
    currentOutput: 5.1,
    ectBalance: 512.30,
    energyGenerated: 31.2,
    percentChange: 12.5,
  },
  {
    id: "3",
    walletAddress: "0x9C1D...F2A7",
    location: "Makati",
    lat: 14.5547,
    lng: 121.0244,
    currentOutput: 3.8,
    ectBalance: 245.80,
    energyGenerated: 18.5,
    percentChange: 5.2,
  },
]

export function CommunityMapContent() {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(placeholderMarkers[0])
  const [ectAmount, setEctAmount] = useState("")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Community Map</h1>
        <p className="text-muted-foreground mt-1">
          Explore registered solar energy producers in your area
        </p>
      </div>

      {/* Map Container - HEIGHT HAS BEEN UPDATED HERE */}
      <div className="relative w-full h-[75vh] min-h-[600px] rounded-xl overflow-hidden border border-border">
        
        {/* THE REAL INTERACTIVE MAP ENGINE */}
        <div className="absolute inset-0 z-0">
           <InteractiveMap markers={placeholderMarkers} onMarkerClick={setSelectedMarker} />
        </div>

        {/* Selected Marker Popup - Preserved exactly from your v0 design */}
        {selectedMarker && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-72 bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-xl z-30">
            <button
              onClick={() => setSelectedMarker(null)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            {/* User Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground">{selectedMarker.walletAddress}</p>
                <p className="text-xs text-muted-foreground">{selectedMarker.location}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Current Output</p>
                <p className="text-lg font-bold text-primary">
                  {selectedMarker.currentOutput} <span className="text-xs font-normal">kWh</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ECT Balance</p>
                <p className="text-lg font-bold text-foreground">
                  {selectedMarker.ectBalance} <span className="text-xs font-normal text-primary">ECT</span>
                </p>
              </div>
            </div>

            {/* Send Offer */}
            <div className="flex gap-2 mb-4">
              <div className="flex-1">
                <select className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>ECT: Smart</option>
                  <option>ECT: Meralco</option>
                </select>
              </div>
              <input
                type="number"
                value={ectAmount}
                onChange={(e) => setEctAmount(e.target.value)}
                placeholder="Amount"
                className="w-20 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm">
                Send Offer
              </button>
            </div>

            {/* Energy Generated */}
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Energy Generated</p>
                <p className="text-xs text-muted-foreground">Last 7 Days</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-foreground">
                  {selectedMarker.energyGenerated} <span className="text-sm font-normal text-muted-foreground">kWh</span>
                </p>
                <span className="flex items-center gap-1 text-xs text-primary">
                  <TrendingUp className="w-3 h-3" />
                  {selectedMarker.percentChange}%
                </span>
              </div>

              {/* Mini chart placeholder */}
              <div className="flex items-end gap-1 h-12 mt-3">
                {[40, 55, 45, 70, 60, 80, 75].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary/30 rounded-t"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>March 21</span>
                <span>March 27</span>
                <span>Today</span>
              </div>

              <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                Approximate location only
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
            <Zap className="w-2 h-2 text-primary-foreground" />
          </div>
          <span>Solar Energy Producer</span>
        </div>
      </div>
    </div>
  )
}