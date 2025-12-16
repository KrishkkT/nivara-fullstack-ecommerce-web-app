import Link from "next/link"
import { redirect } from 'next/navigation'
import { getSession } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, Home } from "lucide-react"

export const metadata = {
  title: "Profile Information | NIVARA",
  description: "Manage your personal information",
}

export default async function ProfileInformationPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/account" className="hover:text-foreground transition-colors">Account</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/profile" className="hover:text-foreground transition-colors">Profile</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Information</span>
      </nav>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif tracking-tight mb-2">Profile Information</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <p className="mt-1">{session.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email Address</label>
                  <p className="mt-1">{session.email}</p>
                </div>
              </div>
              <Separator />
              <div>
                <Button variant="outline">Edit Information</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}