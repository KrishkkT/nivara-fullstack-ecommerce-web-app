import { redirect } from 'next/navigation'
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { ProfileForm } from "@/components/profile-form"
import { AddressManager } from "@/components/address-manager"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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

        {/* Navigation */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/profile/information">Profile Information</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/profile/addresses">Saved Addresses</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/profile/change-password">Change Password</Link>
          </Button>
        </div>

        {/* Profile Information Section */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Personal Information</h2>
            <Button variant="outline" asChild size="sm">
              <Link href="/profile/information">Edit</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{user[0].full_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user[0].email}</p>
            </div>
            {user[0].phone && (
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{user[0].phone}</p>
              </div>
            )}
          </div>
        </div>

        {/* Addresses Section */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Saved Addresses</h2>
            <Button variant="outline" asChild size="sm">
              <Link href="/profile/addresses">Manage</Link>
            </Button>
          </div>
          <AddressManager addresses={addresses} userId={session.userId} />
        </div>
      </div>
    </div>
  )
}