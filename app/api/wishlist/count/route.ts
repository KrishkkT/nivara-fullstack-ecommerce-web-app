import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ count: 0 })
    }

    const result = await sql`
      SELECT COUNT(*) as count
      FROM wishlist
      WHERE user_id = ${session.userId}
    `

    return NextResponse.json({ count: Number(result[0]?.count || 0) })
  } catch (error) {
    console.error("[v0] Wishlist count error:", error)
    return NextResponse.json({ count: 0 })
  }
}
