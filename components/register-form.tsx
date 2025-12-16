"use client"

import { useFormState } from "react-dom"
import { signUp } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RegisterForm() {
  const [state, formAction] = useFormState(signUp, null)

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" name="fullName" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>

      {state?.error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {state.error}
        </div>
      )}

      <Button type="submit" className="w-full">
        Create Account
      </Button>
    </form>
  )
}
