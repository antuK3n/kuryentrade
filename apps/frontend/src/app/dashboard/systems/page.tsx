import { Metadata } from "next"
import { DashboardLayout } from "@/components/kuryen/dashboard-layout"
import { MySystemsContent } from "@/components/kuryen/my-systems-content"

export const metadata: Metadata = {
  title: "My Systems - KuryenTrade",
  description: "Manage your registered solar panel systems",
}

export default function SystemsPage() {
  return (
    <DashboardLayout>
      <MySystemsContent />
    </DashboardLayout>
  )
}
