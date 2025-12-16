import type { Metadata } from "next"
import Link from "next/link"
import { RegisterForm } from "@/components/register-form"

export const metadata: Metadata = {
  title: "Create Account | NIVARA",
  description: "Create your NIVARA account",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-serif tracking-tight">Join NIVARA</h1>
          <p className="mt-2 text-muted-foreground">Create your account to start shopping</p>
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}