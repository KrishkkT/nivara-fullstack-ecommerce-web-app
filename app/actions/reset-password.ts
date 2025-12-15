"use server"

import { sql } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function resetPassword(email: string, newPassword: string) {
  // Validation
  if (!email || !newPassword) {
    return { error: "Email and password are required" }
  }

  if (newPassword.length < 8) {
    return { error: "Password must be at least 8 characters" }
  }

  try {
    // Check if user exists
    const userResult: any = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (userResult.length === 0) {
      return { error: "User not found" }
    }

    const userId = userResult[0].id

    // Hash the new password
    const passwordHash = await hashPassword(newPassword)

    // Update the user's password
    await sql`
      UPDATE users 
      SET password_hash = ${passwordHash}, 
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${userId}
    `

    return { success: true }
  } catch (error) {
    console.error("[v0] Password reset error:", error)
    return { error: "Failed to reset password" }
  }
}