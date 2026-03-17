import { Metadata } from "next"
import { DashboardLayout } from "@/components/kuryen/dashboard-layout"
import { CommunityMapContent } from "@/components/kuryen/community-map-content"

export const metadata: Metadata = {
  title: "Community Map - KuryenTrade",
  description: "Explore registered solar energy producers in your area",
}

export default function MapPage() {
  return (
    <DashboardLayout>
      <CommunityMapContent />
    </DashboardLayout>
  )
}
