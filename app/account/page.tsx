import { redirect } from 'next/navigation'
import { sql } from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signOut } from "@/app/actions/auth"

export const metadata = {
  title: "My Account | NIVARA",
  description: "Manage your account and orders",
}

export default async function AccountPage() {
  // For now, let's show a simple account page without authentication
  // We'll implement proper authentication later
  
  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Welcome to Your Account</h2>
        <p className="text-gray-600 mb-4">This is a placeholder account page.</p>
        
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