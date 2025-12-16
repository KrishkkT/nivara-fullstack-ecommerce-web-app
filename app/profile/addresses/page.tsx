import Link from "next/link"
import { redirect } from 'next/navigation'
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, Plus } from "lucide-react"
import { AddressForm } from "@/components/address-form"
import { AddressList } from "@/components/address-list"

export const metadata = {
  title: "Saved Addresses | NIVARA",
  description: "Manage your saved addresses",
}

export default async function AddressesPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const addresses = await sql`
    SELECT * FROM addresses 
    WHERE user_id = ${session.userId}
    ORDER BY is_default DESC, created_at DESC
  `

  return (
    <div className="container px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/account" className="hover:text-foreground transition-colors">Account</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/profile" className="hover:text-foreground transition-colors">Profile</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Addresses</span>
      </nav>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-serif tracking-tight mb-2">Saved Addresses</h1>
              <p className="text-muted-foreground">Manage your delivery addresses</p>
            </div>
            <Button asChild>
              <Link href="#add-address">
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Addresses</CardTitle>
                <CardDescription>Manage your saved delivery addresses</CardDescription>
              </CardHeader>
              <CardContent>
                <AddressList addresses={addresses} />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card id="add-address">
              <CardHeader>
                <CardTitle>Add New Address</CardTitle>
                <CardDescription>Add a new delivery address</CardDescription>
              </CardHeader>
              <CardContent>
                <AddressForm userId={session.userId} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}