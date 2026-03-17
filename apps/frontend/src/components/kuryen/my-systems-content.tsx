"use client"

import { useState } from "react"
import { Sun, Zap, Eye, Plus, MapPin, Settings, X, EyeOff } from "lucide-react"

interface SolarSystem {
  id: string
  name: string
  location: string
  registeredDate: string
  capacity: number
  currentOutput: number
  totalGenerated: number
  efficiency: number
  status: "online" | "offline"
  visibleOnMap: boolean
}

const placeholderSystems: SolarSystem[] = [
  {
    id: "1",
    name: "Rooftop Solar Array A",
    location: "Quezon City, Manila",
    registeredDate: "Jan 15, 2024",
    capacity: 5.5,
    currentOutput: 4.3,
    totalGenerated: 2845.6,
    efficiency: 78,
    status: "online",
    visibleOnMap: true,
  },
  {
    id: "2",
    name: "Backyard Solar Panel",
    location: "Makati, Metro Manila",
    registeredDate: "Feb 08, 2024",
    capacity: 3.2,
    currentOutput: 0,
    totalGenerated: 1523.8,
    efficiency: 0,
    status: "offline",
    visibleOnMap: false,
  },
  {
    id: "3",
    name: "Rooftop Solar Array B",
    location: "Quezon City, Manila",
    registeredDate: "Feb 20, 2024",
    capacity: 6.7,
    currentOutput: 5.2,
    totalGenerated: 12435.6,
    efficiency: 66,
    status: "online",
    visibleOnMap: true,
  },
]

export function MySystemsContent() {
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [systems] = useState<SolarSystem[]>(placeholderSystems)

  const totalSystems = systems.length
  const totalCapacity = systems.reduce((acc, sys) => acc + sys.capacity, 0)
  const currentOutput = systems.reduce((acc, sys) => acc + sys.currentOutput, 0)
  const visibleOnMap = systems.filter((sys) => sys.visibleOnMap).length

  return (
    <div className="space-y-6">
      
      {/* Header - RESTORED ORIGINAL FONTS + UPDATED COLORS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">My Solar Panel Systems</h1>
          <p className="text-muted-foreground mt-1">Registered and manage your solar energy systems</p>
        </div>

        <button
          onClick={() => setShowRegisterForm(!showRegisterForm)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          Register New System
        </button>
      </div>

      {/* Stats Cards - RESTORED ORIGINAL FONTS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0d2920] border border-primary/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Sun className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Systems</p>
              <p className="text-2xl font-bold text-white">{totalSystems}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#0d2920] border border-primary/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Capacity</p>
              <p className="text-2xl font-bold text-white">
                {totalCapacity.toFixed(1)} <span className="text-sm font-normal text-primary">kW</span>
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#0d2920] border border-primary/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current Output</p>
              <p className="text-2xl font-bold text-white">
                {currentOutput.toFixed(1)} <span className="text-sm font-normal text-primary">kW</span>
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#0d2920] border border-primary/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Visible on Map</p>
              <p className="text-2xl font-bold text-white">{visibleOnMap}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Register Form - RESTORED ORIGINAL FONTS */}
      {showRegisterForm && (
        <div className="bg-[#0d2920] border border-primary/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Register New Solar System</h2>
            <button onClick={() => setShowRegisterForm(false)} className="text-muted-foreground hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">System Name *</label>
              <input
                type="text"
                placeholder="e.g., Rooftop Solar Array"
                className="w-full bg-[#0a1f1a] border border-primary/30 rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Capacity (kW) *</label>
              <input
                type="number"
                placeholder="0.0"
                className="w-full bg-[#0a1f1a] border border-primary/30 rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Location *</label>
              <input
                type="text"
                placeholder="City, Region"
                className="w-full bg-[#0a1f1a] border border-primary/30 rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">IoT Device ID (Optional)</label>
              <input
                type="text"
                placeholder="Device Identifier"
                className="w-full bg-[#0a1f1a] border border-primary/30 rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" id="showOnMap" className="w-4 h-4 accent-primary" />
            <label htmlFor="showOnMap" className="text-sm text-muted-foreground">
              Show on Community Map
            </label>
          </div>
          <div className="flex gap-3 mt-6">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Register System
            </button>
            <button
              onClick={() => setShowRegisterForm(false)}
              className="text-muted-foreground hover:text-white px-4 py-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Systems List */}
      <div className="space-y-4">
        {systems.map((system) => (
          <SystemCard key={system.id} system={system} />
        ))}
      </div>
    </div>
  )
}

function SystemCard({ system }: { system: SolarSystem }) {
  return (
    <div className="bg-[#0d2920] border border-primary/30 rounded-xl p-4 md:p-6">
      {/* Card Header - RESTORED ORIGINAL FONTS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Sun className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{system.name}</h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {system.location}
              </span>
              <span>•</span>
              <span>Registered {system.registeredDate}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              system.status === "online" ? "bg-primary/20 text-primary" : "bg-red-500/20 text-red-400"
            }`}
          >
            {system.status === "online" ? "Online" : "Offline"}
          </span>
          <button className="p-2 hover:bg-[#0a1f1a] rounded-lg transition-colors">
            <Settings className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Stats Grid - RESTORED ORIGINAL FONTS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-[#0a1f1a] rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Capacity</p>
          <p className="text-lg font-bold text-white">
            {system.capacity} <span className="text-xs font-normal text-primary">kW</span>
          </p>
        </div>
        <div className="bg-[#0a1f1a] rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Current Output</p>
          <p className="text-lg font-bold text-white">
            <span className={system.currentOutput > 0 ? "text-primary" : "text-red-400"}>
              {system.currentOutput}
            </span>{" "}
            <span className="text-xs font-normal text-primary">kW</span>
          </p>
        </div>
        <div className="bg-[#0a1f1a] rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Total Generated</p>
          <p className="text-lg font-bold text-white">
            {system.totalGenerated.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">kWh</span>
          </p>
        </div>
        <div className="bg-[#0a1f1a] rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Efficiency</p>
          <p className="text-lg font-bold text-white">
            {system.efficiency}
            <span className="text-xs font-normal text-muted-foreground">%</span>
          </p>
        </div>
      </div>

      {/* Card Footer - RESTORED ORIGINAL FONTS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-primary/10">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {system.visibleOnMap ? (
            <>
              <Eye className="w-4 h-4 text-primary" />
              <span>Visible on Community Map</span>
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4" />
              <span>Hidden from Community Map</span>
            </>
          )}
        </div>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            system.visibleOnMap
              ? "bg-[#0a1f1a] text-white hover:bg-[#0a1f1a]/80"
              : "bg-primary/20 text-primary hover:bg-primary/30"
          }`}
        >
          {system.visibleOnMap ? "Hide from Map" : "Show on Map"}
        </button>
      </div>
    </div>
  )
}