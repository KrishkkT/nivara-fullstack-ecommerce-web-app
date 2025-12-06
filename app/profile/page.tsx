import { redirect } from 'next/navigation'
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { ProfileForm } from "@/components/profile-form"
import { AddressManager } from "@/components/address-manager"

export const metadata = {
  title: "My Profile | NIVARA",
  description: "Manage your profile and addresses",
}

export default async function ProfilePage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const user = await sql`
    SELECT * FROM users WHERE id = ${session.userId}
  `

  const addresses = await sql`
    SELECT * FROM addresses 
    WHERE user_id = ${session.userId}
    ORDER BY is_default DESC, created_at DESC
  `

  return (
    <div className="container px-4 py-12 animate-fadeIn">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-serif tracking-tight mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account details and addresses</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
          <ProfileForm user={user[0]} />
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Saved Addresses</h2>
          <AddressManager addresses={addresses} userId={session.userId} />
        </div>
      </div>
    </div>
  )
}
