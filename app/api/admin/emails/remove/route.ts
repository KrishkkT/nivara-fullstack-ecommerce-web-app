import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyAuth } from "@/lib/session"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("session")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await verifyAuth(token)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const id = formData.get("id") as string

    if (!id) {
      return NextResponse.json({ error: "Email ID is required" }, { status: 400 })
    }

    // Don't allow removal of the last active email
    const activeEmails = await sql`
      SELECT COUNT(*) as count FROM admin_emails WHERE is_active = true
    `
    
    if (activeEmails[0].count <= 1) {
      const emailToRemove = await sql`
        SELECT is_active FROM admin_emails WHERE id = ${Number.parseInt(id)}
      `
      
      if (emailToRemove.length > 0 && emailToRemove[0].is_active) {
        return NextResponse.json({ error: "Cannot remove the last active email" }, { status: 400 })
      }
    }

    await sql`
      DELETE FROM admin_emails
      WHERE id = ${Number.parseInt(id)}
    `

    return NextResponse.redirect(new URL("/admin/emails", request.url))
  } catch (error: any) {
    console.error("[v0] Remove admin email error:", error)
    return NextResponse.json({ error: "Failed to remove email" }, { status: 500 })
  }
}