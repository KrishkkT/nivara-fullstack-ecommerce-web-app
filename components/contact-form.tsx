"use client"

import { useForm, ValidationError } from "@formspree/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ContactForm() {
  const [state, handleSubmit] = useForm("xpwkwber")

  if (state.succeeded) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center animate-fade-in">
        <div className="mb-4 text-4xl text-green-600">✓</div>
        <h3 className="mb-2 text-xl font-semibold">Thank you for contacting us!</h3>
        <p className="text-muted-foreground">
          We've received your message and will get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-card p-8">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input id="name" name="name" required disabled={state.submitting} />
        <ValidationError prefix="Name" field="name" errors={state.errors} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" name="email" type="email" required disabled={state.submitting} />
        <ValidationError prefix="Email" field="email" errors={state.errors} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" name="phone" type="tel" disabled={state.submitting} />
        <ValidationError prefix="Phone" field="phone" errors={state.errors} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject *</Label>
        <Input id="subject" name="subject" required disabled={state.submitting} />
        <ValidationError prefix="Subject" field="subject" errors={state.errors} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea id="message" name="message" rows={6} required disabled={state.submitting} />
        <ValidationError prefix="Message" field="message" errors={state.errors} />
      </div>

      <Button type="submit" className="w-full" disabled={state.submitting}>
        {state.submitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  )
}
