import { redirect } from 'next/navigation'
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { AddressManager } from "@/components/address-manager"

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
    <div className="container px-4 py-12 animate-fadeIn">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-serif tracking-tight mb-2">Saved Addresses</h1>
          <p className="text-muted-foreground">Manage your delivery addresses</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <AddressManager addresses={addresses} userId={session.userId} />
        </div>
      </div>
    </div>
  )
}