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
    const isActive = formData.get("is_active") === "true"

    if (!id) {
      return NextResponse.json({ error: "Email ID is required" }, { status: 400 })
    }

    await sql`
      UPDATE admin_emails
      SET is_active = ${isActive}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${Number.parseInt(id)}
    `

    return NextResponse.redirect(new URL("/admin/emails", request.url))
  } catch (error: any) {
    console.error("[v0] Toggle admin email error:", error)
    return NextResponse.json({ error: "Failed to update email" }, { status: 500 })
  }
}