import { redirect } from 'next/navigation'
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"

export const metadata = {
  title: "My Account | NIVARA",
  description: "Manage your account and orders",
}

export default async function AccountPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const user = await sql`
    SELECT * FROM users WHERE id = ${session.userId}
  `

  return (
    <div className="container px-4 py-12">
      <h1 className="text-4xl font-serif tracking-tight mb-8">My Account</h1>
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">{user[0].full_name}</h2>
        <p className="text-muted-foreground">{user[0].email}</p>
      </div>
    </div>
  )
}