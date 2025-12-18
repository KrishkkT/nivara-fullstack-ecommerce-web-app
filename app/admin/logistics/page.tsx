import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyAuth } from "@/lib/session"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { 
  ShiprocketShipmentCreation,
  ShiprocketPickupManagement,
  ShiprocketOrderDetails,
  ShiprocketTrackingEvents
} from "@/components/admin/shiprocket-components"

export default async function AdminLogisticsPage() {
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
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Logistics Management</h1>
              <p className="text-muted-foreground">Manage your Shiprocket integration</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ShiprocketShipmentCreation />
          <ShiprocketPickupManagement />
        </div>
        
        <div className="mt-6">
          <ShiprocketOrderDetails />
        </div>
        
        <div className="mt-6">
          <ShiprocketTrackingEvents />
        </div>
      </div>
    </div>
  )
}