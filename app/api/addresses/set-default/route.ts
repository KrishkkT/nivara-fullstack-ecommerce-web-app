import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { addressId } = await request.json()

    // Unset all defaults
    await sql`
      UPDATE addresses
      SET is_default = false
      WHERE user_id = ${session.userId}
    `

    // Set new default
    await sql`
      UPDATE addresses
      SET is_default = true
      WHERE id = ${addressId} AND user_id = ${session.userId}
    `

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Set default address error:", error)
    return NextResponse.json({ error: "Failed to set default address" }, { status: 500 })
  }
}
