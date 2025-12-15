"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { resetPassword } from "@/app/actions/reset-password"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ResetPasswordForm() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"email" | "reset">("email")
  const [email, setEmail] = useState("")

  async function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string

    // In a real implementation, you would send a password reset email
    // For now, we'll just move to the reset step
    setEmail(email)
    setStep("reset")
    setLoading(false)
  }

  async function handleResetSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess(false)
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const result = await resetPassword(email, password)
      
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    } catch (err) {
      setError("Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (step === "reset") {
    return (
      <form onSubmit={handleResetSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={email}
            readOnly
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            required 
            placeholder="••••••••" 
            minLength={8}
          />
          <p className="text-xs text-muted-foreground">At least 8 characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input 
            id="confirmPassword" 
            name="confirmPassword" 
            type="password" 
            required 
            placeholder="••••••••" 
          />
        </div>

        {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}
        
        {success && (
          <div className="bg-green-100 text-green-800 text-sm p-3 rounded-md">
            Password reset successfully! Redirecting to login...
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>

        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          onClick={() => setStep("email")}
          disabled={loading}
        >
          Back
        </Button>
      </form>
    )
  }

  return (
    <form onSubmit={handleEmailSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          autoComplete="email" 
          required 
          placeholder="your@email.com" 
        />
      </div>

      {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Processing..." : "Continue"}
      </Button>
    </form>
  )
}