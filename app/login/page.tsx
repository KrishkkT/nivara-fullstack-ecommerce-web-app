import type { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/login-form"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Login | NIVARA",
  description: "Sign in to your NIVARA account",
}

function LoginPageContent() {
  // This component will only be rendered on the client side
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-serif tracking-tight">Welcome Back</h1>
          <p className="mt-2 text-muted-foreground">Sign in to your NIVARA account</p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>

        <div className="text-center text-sm space-y-2">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-foreground hover:underline">
              Create one
            </Link>
          </p>
          <p className="text-muted-foreground">
            Forgot your password?{" "}
            <Link href="/reset-password" className="font-medium text-foreground hover:underline">
              Reset it
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}