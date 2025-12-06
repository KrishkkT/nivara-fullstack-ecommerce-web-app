import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ count: 0 })
    }

    const result = await sql`
      SELECT COALESCE(SUM(quantity), 0) as count
      FROM cart_items
      WHERE user_id = ${session.userId}
    `

    return NextResponse.json({ count: Number(result[0].count) })
  } catch (error) {
    console.error("[v0] Cart count error:", error)
    return NextResponse.json({ count: 0 })
  }
}
