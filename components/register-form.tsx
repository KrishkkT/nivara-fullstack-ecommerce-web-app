"use client"

import { useFormState } from "react-dom"
import { signUp } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RegisterForm() {
  const [state, formAction] = useFormState(signUp, null)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
        />
      </div>

      {state?.error && (
        <div className="text-red-500 text-sm">
          {state.error}
        </div>
      )}

      <Button type="submit" className="w-full">
        Create Account
      </Button>
    </form>
  )
}