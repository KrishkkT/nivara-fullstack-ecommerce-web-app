"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface UserData {
  full_name: string
  email: string
  phone: string | null
}

export function ProfileForm({ initialData }: { initialData: UserData }) {
  const [formData, setFormData] = useState<UserData>(initialData)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Update form data when initialData changes
  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Error",
        description: "Invalid email format",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    // Validate phone number if provided
    if (formData.phone && !/^[+]?[\d\s\-()]{10,15}$/.test(formData.phone)) {
      toast({
        title: "Error",
        description: "Invalid phone number format",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/profile/information", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update profile",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={formData.email} disabled className="bg-muted" />
        <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+1 (555) 123-4567"
        />
      </div>
      
      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  )
}