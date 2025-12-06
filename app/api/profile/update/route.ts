import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { full_name, phone } = await request.json()

    await sql`
      UPDATE users
      SET 
        full_name = ${full_name},
        phone = ${phone},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${session.userId}
    `

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Profile update error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
