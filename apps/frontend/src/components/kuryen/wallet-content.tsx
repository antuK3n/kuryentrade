"use client"

import { useState } from "react"
import { 
  Zap, 
  Copy, 
  ExternalLink, 
  Send, 
  Download,
  ChevronDown,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react"

const monthlyData = [
  { month: "Jan", value: 80 },
  { month: "Feb", value: 120 },
  { month: "Mar", value: 180 },
  { month: "Apr", value: 220 },
  { month: "May", value: 280 },
  { month: "Jun", value: 320 },
]

const transactions = [
  { type: "sent", label: "Sent to", address: "0x5F2A...8B84", time: "2 hours ago", amount: "-25.5", status: "Completed" },
  { type: "received", label: "Received from", address: "0x9C1D...F2A7", time: "5 hours ago", amount: "+42.3", status: "Completed" },
  { type: "sent", label: "Sent to", address: "0x5F2A...8B84", time: "2 hours ago", amount: "-25.5", status: "Completed" },
  { type: "received", label: "Received from", address: "0x9C1D...F2A7", time: "3 hours ago", amount: "+42.3", status: "Completed" },
]

export function WalletContent() {
  const [copied, setCopied] = useState(false)
  const walletAddress = "0x1234567890ABCDEF1234567890ABCDEF12345678"

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Wallet</h1>
        <p className="text-muted-foreground mt-1">Manage your ECT tokens and transactions</p>
      </div>

      {/* Balance Card */}
      <div className="bg-[#0d2920] border border-primary/30 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Balance</p>
            <h2 className="text-4xl font-bold text-foreground mt-1">
              342.45 <span className="text-xl text-muted-foreground">ECT</span>
            </h2>
            <p className="text-sm text-primary mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" />
              +2.5% this month
            </p>
          </div>
          <button className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center hover:bg-primary/90 transition-all">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Wallet Address */}
      <div className="bg-[#0d2920] border border-primary/30 rounded-xl p-5">
        <p className="text-sm text-muted-foreground mb-2">Your Wallet Address</p>
        <div className="flex items-center gap-3">
          <code className="flex-1 bg-[#0a1f1a] border border-primary/20 rounded-lg px-4 py-3 font-mono text-sm text-foreground overflow-x-auto">
            {walletAddress}
          </code>
          <button 
            onClick={copyAddress}
            className="p-3 bg-[#0a1f1a] border border-primary/20 rounded-lg hover:border-primary/50 transition-all"
            title="Copy address"
          >
            <Copy className={`w-5 h-5 ${copied ? 'text-primary' : 'text-muted-foreground'}`} />
          </button>
          <button 
            className="p-3 bg-[#0a1f1a] border border-primary/20 rounded-lg hover:border-primary/50 transition-all"
            title="View on explorer"
          >
            <ExternalLink className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-all">
            <Send className="w-5 h-5" />
            Send ECT
          </button>
          <button className="flex items-center justify-center gap-2 bg-[#0a1f1a] border border-primary/30 text-foreground py-3 rounded-lg font-medium hover:border-primary/50 transition-all">
            <Download className="w-5 h-5" />
            Receive ECT
          </button>
        </div>
      </div>

      {/* Monthly Activity Chart */}
      <div className="bg-[#0d2920] border border-primary/30 rounded-xl p-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Monthly Activity</h3>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-[#0a1f1a] border border-primary/30 rounded-lg text-sm text-foreground">
            Last 6 months
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-6">
          {/* Chart */}
          <div className="flex-1 h-56 flex items-end justify-between gap-3">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative" style={{ height: '200px' }}>
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-primary/60 rounded-t"
                    style={{ height: `${(data.value / 320) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{data.month}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="w-40 space-y-4">
            <div className="bg-[#0a1f1a] border border-primary/20 rounded-lg p-4">
              <p className="text-xs text-muted-foreground">Energy Produced</p>
              <p className="text-2xl font-bold text-primary">1,245</p>
              <p className="text-xs text-muted-foreground">kWh total</p>
            </div>
            <div className="bg-[#0a1f1a] border border-primary/20 rounded-lg p-4">
              <p className="text-xs text-muted-foreground">Active Trades</p>
              <p className="text-2xl font-bold text-foreground">8</p>
              <p className="text-xs text-muted-foreground">ongoing deals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-[#0d2920] border border-primary/30 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
          <button className="text-sm text-primary hover:underline">View All</button>
        </div>
        <div className="space-y-3">
          {transactions.map((tx, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-4 bg-[#0a1f1a] rounded-lg border border-primary/20"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === 'sent' ? 'bg-orange-500/20' : 'bg-primary/20'
                }`}>
                  {tx.type === 'sent' ? (
                    <ArrowUpRight className="w-5 h-5 text-orange-500" />
                  ) : (
                    <ArrowDownLeft className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{tx.label}</p>
                  <p className="text-xs text-muted-foreground font-mono">{tx.address} • {tx.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-mono font-medium ${
                  tx.type === 'sent' ? 'text-red-400' : 'text-primary'
                }`}>
                  {tx.amount} <span className="text-muted-foreground">ECT</span>
                </p>
                <p className="text-xs text-muted-foreground">{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
