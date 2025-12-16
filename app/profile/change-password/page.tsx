import { redirect } from 'next/navigation'
import { getSession } from "@/lib/session"
import { ChangePasswordForm } from "@/components/change-password-form"

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
    <div className="container px-4 py-12 animate-fadeIn">
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