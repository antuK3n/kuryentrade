import { Metadata } from "next"
import { DashboardLayout } from "@/components/kuryen/dashboard-layout"
import { TransactionHistoryContent } from "@/components/kuryen/transaction-history-content"

export const metadata: Metadata = {
  title: "Transaction History - KuryenTrade",
  description: "View all your ECT transactions and activities",
}

export default function HistoryPage() {
  return (
    <DashboardLayout>
      <TransactionHistoryContent />
    </DashboardLayout>
  )
}
