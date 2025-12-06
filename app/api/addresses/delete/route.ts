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

    await sql`
      DELETE FROM addresses
      WHERE id = ${addressId} AND user_id = ${session.userId}
    `

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Address deletion error:", error)
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 })
  }
}
