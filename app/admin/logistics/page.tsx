// Logistics Dashboard Page
// This page brings together all logistics components in one place

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyAuth } from "@/lib/session"
import { LogisticsDashboard } from "@/components/admin/logistics-dashboard"

export default async function LogisticsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    redirect("/login?redirect=/admin/logistics")
  }

  const user = await verifyAuth(token)
  if (!user || user.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Logistics Management</h1>
        <p className="text-muted-foreground">Manage your shipping orders and logistics</p>
      </div>
      
      {/* Main Orders Dashboard */}
      <LogisticsDashboard />
    </div>
  )
}