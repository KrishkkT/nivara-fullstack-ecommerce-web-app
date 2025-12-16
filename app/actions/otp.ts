"use server"

import { sql } from "@/lib/db"
import { sendEmail } from "@/lib/email"

// Generate a 6-digit OTP
function generateOTP(): string {
  // Ensure we always generate a 6-digit number (pad with leading zeros if necessary)
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  console.log(`[v0] Generated 6-digit OTP: ${otp}`)
  return otp
}

// Send OTP to user's email
export async function sendOTP(email: string) {
  try {
    // Check if user exists
    const userResult: any = await sql`
      SELECT id, email, full_name FROM users WHERE email = ${email}
    `

    if (userResult.length === 0) {
      return { error: "User not found" }
    }

    const user = userResult[0]
    
    // Generate OTP
    const otp = generateOTP()
    const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiration
    
    // Store OTP in database
    await sql`
      INSERT INTO otps (email, otp, expires_at)
      VALUES (${email}, ${otp}, ${expires})
      ON CONFLICT (email) 
      DO UPDATE SET 
        otp = ${otp},
        expires_at = ${expires},
        created_at = CURRENT_TIMESTAMP
    `
    
    // Send OTP via email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset OTP</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #B29789;">Password Reset OTP</h1>
          
          <p>Hello ${user.full_name},</p>
          
          <p>You have requested to reset your password. Please use the following 6-digit OTP to verify your identity:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; padding: 15px 30px; background-color: #f8f8f8; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
              ${otp}
            </div>
          </div>
          
          <p>This OTP will expire in 10 minutes. If you didn't request this password reset, please ignore this email.</p>
          
          <p>Thank you,<br>The NIVARA Team</p>
        </div>
      </body>
      </html>
    `
    
    await sendEmail({
      to: email,
      subject: "Password Reset OTP - NIVARA",
      html: emailHtml
    })
    
    console.log(`[v0] OTP sent to ${email}: ${otp}`)
    return { success: true }
  } catch (error) {
    console.error("[v0] Failed to send OTP:", error)
    return { error: "Failed to send OTP" }
  }
}

// Verify OTP
export async function verifyOTP(email: string, otp: string) {
  try {
    // Get OTP from database
    const otpResult: any = await sql`
      SELECT otp, expires_at FROM otps WHERE email = ${email}
    `
    
    if (!otpResult.length) {
      return { error: "OTP not found or expired" }
    }
    
    const storedOTP = otpResult[0]
    
    // Check if OTP is expired
    if (new Date() > storedOTP.expires_at) {
      // Delete expired OTP
      await sql`DELETE FROM otps WHERE email = ${email}`
      return { error: "OTP has expired" }
    }
    
    // Check if OTP matches
    if (storedOTP.otp !== otp) {
      return { error: "Invalid OTP" }
    }
    
    // Remove OTP after successful verification
    await sql`DELETE FROM otps WHERE email = ${email}`
    
    return { success: true }
  } catch (error) {
    console.error("[v0] Failed to verify OTP:", error)
    return { error: "Failed to verify OTP" }
  }
}

// Reset password after OTP verification
export async function resetPasswordWithOTP(email: string, newPassword: string) {
  try {
    // Validation
    if (!email || !newPassword) {
      return { error: "Email and password are required" }
    }

    if (newPassword.length < 8) {
      return { error: "Password must be at least 8 characters" }
    }

    // Check if user exists
    const userResult: any = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (userResult.length === 0) {
      return { error: "User not found" }
    }

    const userId = userResult[0].id

    // Hash the new password
    const bcrypt = await import("bcryptjs")
    const passwordHash = await bcrypt.hash(newPassword, 12)

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