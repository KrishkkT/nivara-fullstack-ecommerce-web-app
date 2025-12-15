import type { Metadata } from "next"
import Link from "next/link"
import { ResetPasswordForm } from "@/components/reset-password-form"

export const metadata: Metadata = {
  title: "Reset Password | NIVARA",
  description: "Reset your NIVARA account password",
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-serif tracking-tight">Reset Password</h1>
          <p className="mt-2 text-muted-foreground">Enter your email to reset your password</p>
        </div>

        <ResetPasswordForm />

        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href="/login" className="font-medium text-foreground hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}