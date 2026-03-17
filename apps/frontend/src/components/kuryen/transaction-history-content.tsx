"use client"

import { useState } from "react"
import { ArrowUpRight, ArrowDownLeft, Download, Check, X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

interface Transaction {
  id: string
  hash: string
  type: "mint" | "listed" | "sold" | "purchased" | "transfer"
  from: string
  to: string
  amount: number
  timestamp: string
  status: "completed" | "pending"
}

interface TradeRequest {
  id: string
  address: string
  location: string
  distance: string
  timestamp: string
  requestedAmount: number
  offeredPrice: number
  totalPayment: number
  message: string
  status: "pending"
}

const placeholderTransactions: Transaction[] = [
  {
    id: "1",
    hash: "0x59...400C",
    type: "mint",
    from: "System A",
    to: "Wallet",
    amount: 534.3,
    timestamp: "2 hours ago",
    status: "completed",
  },
  {
    id: "2",
    hash: "0x8e...38BC",
    type: "listed",
    from: "Wallet",
    to: "Marketplace",
    amount: 618,
    timestamp: "4 minutes ago",
    status: "pending",
  },
  {
    id: "3",
    hash: "0xb5...28BC",
    type: "sold",
    from: "Wallet",
    to: "0x9C1D...F2A7",
    amount: 436.3,
    timestamp: "1 day ago",
    status: "completed",
  },
  {
    id: "4",
    hash: "0x1d...690C",
    type: "purchased",
    from: "0x5F2A...B8E4",
    to: "Wallet",
    amount: 0.0016,
    timestamp: "2 days ago",
    status: "completed",
  },
  {
    id: "5",
    hash: "0xe6D...29BC",
    type: "transfer",
    from: "Wallet",
    to: "0x7B8E...C4D1",
    amount: 2.474,
    timestamp: "3 days ago",
    status: "completed",
  },
  {
    id: "6",
    hash: "0x3f...12AC",
    type: "mint",
    from: "System B",
    to: "Wallet",
    amount: 128.5,
    timestamp: "4 days ago",
    status: "completed",
  },
]

const placeholderTradeRequests: TradeRequest[] = [
  {
    id: "1",
    address: "0x5F2A...B8E4",
    location: "Quezon City, Manila",
    distance: "0.8 km away",
    timestamp: "10 minutes ago",
    requestedAmount: 15.5,
    offeredPrice: 2.4,
    totalPayment: 37.2,
    message: "Hi! I need energy for my home. Can we trade?",
    status: "pending",
  },
  {
    id: "2",
    address: "0x7B3E...C4D1",
    location: "Pasig City, Manila",
    distance: "2.2 km away",
    timestamp: "3 hours ago",
    requestedAmount: 22.2,
    offeredPrice: 2.6,
    totalPayment: 57.2,
    message: "Looking for available energy. Available?",
    status: "pending",
  },
  {
    id: "3",
    address: "0x5F2A...B8E4",
    location: "Quezon City, Manila",
    distance: "0.8 km away",
    timestamp: "10 minutes ago",
    requestedAmount: 10,
    offeredPrice: 2.4,
    totalPayment: 24.0,
    message: "Regular buyer here. Interested in your energy!",
    status: "pending",
  },
]

export function TransactionHistoryContent() {
  const [activeTab, setActiveTab] = useState<"history" | "requests">("history")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredTransactions = placeholderTransactions.filter((tx) => {
    if (typeFilter !== "all" && tx.type !== typeFilter) return false
    if (statusFilter !== "all" && tx.status !== statusFilter) return false
    return true
  })

  const getTypeLabel = (type: Transaction["type"]) => {
    switch (type) {
      case "mint":
        return "Mint ECT"
      case "listed":
        return "Listed for Sale"
      case "sold":
        return "Sold ECT"
      case "purchased":
        return "Purchased ECT"
      case "transfer":
        return "Transfer"
    }
  }

  const getTypeIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "mint":
      case "purchased":
        return <ArrowDownLeft className="w-3 h-3" />
      case "listed":
      case "sold":
      case "transfer":
        return <ArrowUpRight className="w-3 h-3" />
    }
  }

  const getTypeColor = (type: Transaction["type"]) => {
    switch (type) {
      case "mint":
        return "bg-primary text-primary-foreground"
      case "listed":
        return "bg-yellow-500 text-black"
      case "sold":
        return "bg-red-400 text-white"
      case "purchased":
        return "bg-emerald-400 text-black"
      case "transfer":
        return "bg-blue-400 text-white"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Transaction History</h1>
        <p className="text-muted-foreground mt-1">View all your energy trades, minting events, and tokens</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "history"
              ? "bg-primary/20 text-primary border border-primary"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          Transaction History
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
            activeTab === "requests"
              ? "bg-primary/20 text-primary border border-primary"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          Trade Requests
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </button>
      </div>

      {activeTab === "history" ? (
        <>
          {/* Filters */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-wrap gap-3">
                {/* Type Filter */}
                <div className="relative">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="appearance-none bg-input border border-border rounded-lg px-4 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All types</option>
                    <option value="mint">Mint ECT</option>
                    <option value="listed">Listed for Sale</option>
                    <option value="sold">Sold ECT</option>
                    <option value="purchased">Purchased ECT</option>
                    <option value="transfer">Transfer</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-input border border-border rounded-lg px-4 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All statuses</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>

                {/* Location Filter */}
                <div className="relative">
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="appearance-none bg-input border border-border rounded-lg px-4 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All locations</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <button className="flex items-center gap-2 bg-primary/20 text-primary px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/30 transition-colors">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      HASH
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      TYPE
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {"FROM → TO"}
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      AMOUNT
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      STATUS
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      TIME
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getTypeColor(tx.type)}`}>
                            {getTypeIcon(tx.type)}
                          </div>
                          <span className="text-sm text-foreground font-mono">{tx.hash}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-foreground">{getTypeLabel(tx.type)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground">
                          {tx.from} <span className="text-primary mx-1">→</span> {tx.to}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-primary">{tx.amount} <span className="text-muted-foreground">ECT</span></span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            tx.status === "completed"
                              ? "bg-primary/20 text-primary"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground">{tx.timestamp}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTransactions.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Showing 1 - 6 of 6
            </p>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50" disabled>
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
                    currentPage === page
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Trade Requests Tab */
        <div className="space-y-4">
          {placeholderTradeRequests.map((request) => (
            <div key={request.id} className="bg-card border border-border rounded-xl p-4 md:p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{request.address}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {request.location} • {request.distance}
                    </p>
                    <p className="text-xs text-muted-foreground">{request.timestamp}</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 text-xs font-medium">
                  Pending
                </span>
              </div>

              {/* Details */}
              <div className="grid grid-cols-3 gap-4 mb-4 bg-secondary/30 rounded-lg p-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Requested Amount</p>
                  <p className="text-sm font-medium text-foreground">{request.requestedAmount} <span className="text-primary">kWh</span></p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Offered Price</p>
                  <p className="text-sm font-medium text-foreground">{request.offeredPrice} <span className="text-primary">ECT/kWh</span></p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Payment</p>
                  <p className="text-sm font-bold text-primary">{request.totalPayment.toFixed(2)} ECT</p>
                </div>
              </div>

              {/* Message */}
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-1">Message:</p>
                <p className="text-sm text-foreground italic">&quot;{request.message}&quot;</p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  <Check className="w-4 h-4" />
                  Accept Trade
                </button>
                <button className="flex items-center justify-center gap-2 bg-transparent border border-red-400 text-red-400 px-4 py-2.5 rounded-lg font-medium hover:bg-red-400/10 transition-colors">
                  <X className="w-4 h-4" />
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
