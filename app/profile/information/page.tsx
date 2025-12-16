import { redirect } from 'next/navigation'
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { ProfileForm } from "@/components/profile-form"

export const metadata = {
  title: "Profile Information | NIVARA",
  description: "Manage your profile information",
}

export default async function ProfileInformationPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const user = await sql`
    SELECT * FROM users WHERE id = ${session.userId}
  `

  return (
    <div className="container px-4 py-12 animate-fadeIn">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-serif tracking-tight mb-2">Profile Information</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Personal Details</h2>
          <ProfileForm user={user[0]} />
        </div>
      </div>
    </div>
  )
}