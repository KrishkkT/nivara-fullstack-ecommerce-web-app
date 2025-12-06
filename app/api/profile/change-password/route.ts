import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { verifyPassword, hashPassword } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { currentPassword, newPassword } = await request.json()
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 })
    }
    
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }
    
    // Get user with password hash
    const userResult = await sql`
      SELECT id, email, password_hash, full_name, phone, role, created_at
      FROM users
      WHERE id = ${session.userId}
    `
    
    // Cast to any[] to handle the typing issue
    const users = userResult as any[]
    
    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    const user = users[0]
    
    // Verify current password
    const isPasswordValid = await verifyPassword(currentPassword, user.password_hash)
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }
    
    // Hash new password
    const newPasswordHash = await hashPassword(newPassword)
    
    // Update password in database
    await sql`
      UPDATE users
      SET password_hash = ${newPasswordHash}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${session.userId}
    `
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Password change error:", error)
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 })
  }
}