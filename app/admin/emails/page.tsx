import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyAuth } from "@/lib/session"
import { sql } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function AdminEmailsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    redirect("/login?redirect=/admin/emails")
  }

  const user = await verifyAuth(token)
  if (!user || user.role !== "admin") {
    redirect("/")
  }

  const adminEmails = await sql`
    SELECT * FROM admin_emails 
    ORDER BY created_at DESC
  `

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-serif font-bold text-foreground">Email Notifications</h1>
        <p className="text-muted-foreground mt-2">Manage admin email addresses for order notifications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Email</CardTitle>
          <CardDescription>Add an email address to receive order notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <form action="/api/admin/emails/add" method="POST" className="flex gap-4">
            <Input 
              type="email" 
              name="email" 
              placeholder="admin@example.com" 
              required 
              className="flex-1"
            />
            <Button type="submit">Add Email</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Emails</CardTitle>
          <CardDescription>All email addresses that receive order notifications</CardDescription>
        </CardHeader>
        <CardContent>
          {adminEmails.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">No email addresses configured</p>
          ) : (
            <div className="space-y-4">
              {adminEmails.map((email: any) => (
                <div key={email.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{email.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Added {new Date(email.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {email.is_active ? (
                      <form action="/api/admin/emails/toggle" method="POST">
                        <input type="hidden" name="id" value={email.id} />
                        <input type="hidden" name="is_active" value="false" />
                        <Button type="submit" variant="outline" size="sm">
                          Disable
                        </Button>
                      </form>
                    ) : (
                      <form action="/api/admin/emails/toggle" method="POST">
                        <input type="hidden" name="id" value={email.id} />
                        <input type="hidden" name="is_active" value="true" />
                        <Button type="submit" variant="outline" size="sm">
                          Enable
                        </Button>
                      </form>
                    )}
                    <form action="/api/admin/emails/remove" method="POST">
                      <input type="hidden" name="id" value={email.id} />
                      <Button type="submit" variant="outline" size="sm">
                        Remove
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}