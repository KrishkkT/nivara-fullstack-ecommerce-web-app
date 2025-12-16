import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signOut } from "@/app/actions/auth"
import { getSession } from "@/lib/session"

export const metadata = {
  title: "My Account | NIVARA",
  description: "Manage your account and orders",
}

export default async function AccountPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Welcome, {session.fullName}</h2>
        <p className="text-gray-600 mb-4">Email: {session.email}</p>
        
        <div className="space-y-2">
          <Link href="/orders">
            <Button variant="outline" className="w-full">
              View My Orders
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline" className="w-full">
              Update Profile
            </Button>
          </Link>
        </div>
        
        <form action={signOut} className="mt-6">
          <Button type="submit" variant="outline">
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  )
}
