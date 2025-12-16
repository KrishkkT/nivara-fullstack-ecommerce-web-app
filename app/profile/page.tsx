import Link from "next/link"
import { redirect } from 'next/navigation'
import { getSession } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, Home, User, MapPin, Lock, Settings } from "lucide-react"

export const metadata = {
  title: "Profile | NIVARA",
  description: "Manage your profile settings",
}

export default async function ProfilePage() {
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
        <span className="text-foreground">Profile</span>
      </nav>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif tracking-tight mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your profile settings</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile Menu</CardTitle>
                <CardDescription>Navigate through your profile settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/profile/information" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </Link>
                <Link href="/profile/addresses" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                  <MapPin className="h-5 w-5" />
                  <span>Saved Addresses</span>
                </Link>
                <Link href="/profile/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                  <Settings className="h-5 w-5" />
                  <span>Profile Settings</span>
                </Link>
                <Link href="/profile/change-password" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                  <Lock className="h-5 w-5" />
                  <span>Change Password</span>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Overview</CardTitle>
                <CardDescription>Your profile information at a glance</CardDescription>
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
                    <Button>Edit Profile</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}