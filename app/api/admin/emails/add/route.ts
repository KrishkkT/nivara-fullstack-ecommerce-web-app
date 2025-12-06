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
    const email = formData.get("email") as string

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    await sql`
      INSERT INTO admin_emails (email)
      VALUES (${email})
      ON CONFLICT (email) DO UPDATE SET is_active = true, updated_at = CURRENT_TIMESTAMP
    `

    return NextResponse.redirect(new URL("/admin/emails", request.url))
  } catch (error: any) {
    console.error("[v0] Add admin email error:", error)
    return NextResponse.json({ error: "Failed to add email" }, { status: 500 })
  }
}