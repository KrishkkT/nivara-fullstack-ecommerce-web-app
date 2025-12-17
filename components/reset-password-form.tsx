"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { sendOTP, verifyOTP, resetPasswordWithOTP } from "@/app/actions/otp"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function ResetPasswordForm() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"email" | "otp" | "reset">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const { toast } = useToast()

  async function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string

    try {
      const result = await sendOTP(email)
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setEmail(email)
        setStep("otp")
        setSuccess(true)
        setTimeout(() => setSuccess(false), 5000)
        toast({
          title: "Success",
          description: "OTP sent successfully! Please check your email.",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleOtpSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await verifyOTP(email, otp)
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setStep("reset")
        setSuccess(true)
        setTimeout(() => setSuccess(false), 5000)
        toast({
          title: "Success",
          description: "OTP verified successfully!",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      const result = await resetPasswordWithOTP(email, password)
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setSuccess(true)
        toast({
          title: "Success",
          description: "Password reset successfully! Redirecting to login...",
        })
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle OTP input to ensure it's numeric and 6 digits max
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '') // Remove non-digits
    if (value.length <= 6) {
      setOtp(value)
    }
  }

  if (step === "otp") {
    return (
      <form onSubmit={handleOtpSubmit} className="space-y-6">
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
          <Label htmlFor="otp">Verification Code</Label>
          <Input 
            id="otp" 
            name="otp" 
            type="text" 
            inputMode="numeric"
            pattern="[0-9]*"
            value={otp}
            onChange={handleOtpChange}
            required 
            placeholder="Enter 6-digit code" 
            maxLength={6}
          />
          <p className="text-xs text-muted-foreground">We've sent a 6-digit code to your email</p>
        </div>

        <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
          {loading ? "Verifying..." : "Verify Code"}
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

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending..." : "Send Verification Code"}
      </Button>
    </form>
  )
}