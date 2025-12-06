import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { address_line1, address_line2, city, state, postal_code, country, is_default } = await request.json()

    // If setting as default, unset other defaults
    if (is_default) {
      await sql`
        UPDATE addresses
        SET is_default = false
        WHERE user_id = ${session.userId}
      `
    }

    await sql`
      INSERT INTO addresses (
        user_id, address_line1, address_line2, city, state, postal_code, country, is_default
      ) VALUES (
        ${session.userId}, ${address_line1}, ${address_line2 || null}, ${city}, 
        ${state}, ${postal_code}, ${country}, ${is_default}
      )
    `

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Address creation error:", error)
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 })
  }
}
