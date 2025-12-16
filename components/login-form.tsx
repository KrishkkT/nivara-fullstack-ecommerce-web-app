"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)

    // Simple validation
    if (!email || !password) {
      setError("Email and password are required")
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    try {
      console.log("Attempting to sign in with email:", email)
      const result = await signIn(formData)
      console.log("Sign in result:", result)
      
      if (result?.error) {
        setError(result.error)
      } else {
        // Successful login - redirect to account page
        console.log("Login successful, redirecting to account page")
        router.push("/account")
        router.refresh()
      }
    } catch (err) {
      console.error("Sign in error:", err)
      setError("Failed to sign in. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  )
}