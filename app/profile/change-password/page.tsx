import Link from "next/link"
import { redirect } from 'next/navigation'
import { getSession } from "@/lib/session"
import { ChangePasswordForm } from "@/components/change-password-form"
import { ChevronRight } from "lucide-react"

export const metadata = {
  title: "Change Password | NIVARA",
  description: "Change your account password",
}

export default async function ChangePasswordPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/account" className="hover:text-foreground transition-colors">Account</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/profile" className="hover:text-foreground transition-colors">Profile</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Change Password</span>
      </nav>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif tracking-tight mb-2">Change Password</h1>
          <p className="text-muted-foreground">Update your account password</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  )
}