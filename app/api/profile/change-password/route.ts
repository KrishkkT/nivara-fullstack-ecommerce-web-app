import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { verifyPassword, hashPassword } from "@/lib/auth"
import { sql } from "@/lib/db"
import { sendEmail } from "@/lib/email"

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
    
    // Send password change confirmation email
    try {
      console.log(`[v0] Sending password change confirmation email to ${user.email}`);
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Changed - NIVARA</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #B29789;">Password Changed Successfully</h1>
            
            <p>Hello ${user.full_name},</p>
            
            <p>Your password for your NIVARA account has been successfully changed.</p>
            
            <p>If you did not make this change, please contact our support team immediately.</p>
            
            <p>Thank you,<br>The NIVARA Team</p>
          </div>
        </body>
        </html>
      `;
      
      await sendEmail({
        to: user.email,
        subject: "Password Changed - NIVARA",
        html: emailHtml
      });
      
      console.log(`[v0] Password change confirmation email sent successfully to ${user.email}`);
    } catch (emailError) {
      console.error("[v0] Failed to send password change confirmation email:", emailError);
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Password change error:", error)
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 })
  }
}