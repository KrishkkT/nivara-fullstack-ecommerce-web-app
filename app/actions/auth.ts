"use server"

import { cookies } from "next/headers"
import { createUser, getUserByEmail, verifyPassword } from "@/lib/auth"
import { createSession, setSessionCookie } from "@/lib/session"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { sendEmail, generateWelcomeEmail, generateNewUserNotificationEmail } from "@/lib/email"
import { sanitizeInput, validateAndSanitizeEmail, validatePhoneNumber } from "@/lib/sanitize"

export async function signUp(formData: FormData) {
  const rawEmail = formData.get("email") as string
  const rawPassword = formData.get("password") as string
  const rawFullName = formData.get("fullName") as string
  const rawPhone = formData.get("phone") as string | undefined

  // Sanitize inputs
  const email = validateAndSanitizeEmail(rawEmail)
  const password = sanitizeInput(rawPassword)
  const fullName = sanitizeInput(rawFullName)
  const phone = rawPhone ? validatePhoneNumber(rawPhone) : undefined

  // Validation
  if (!email || !password || !fullName) {
    return { error: "All fields are required" }
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" }
  }

  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return { error: "Email already registered" }
    }

    // Create user
    const user = await createUser(email, password, fullName, phone)

    // Create session
    const token = await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Set secure session cookie
    const cookieStore = await cookies()
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/"
    })

    // Send welcome email to user
    try {
      const emailHtml = generateWelcomeEmail({ full_name: fullName, email });
      await sendEmail({
        to: email,
        subject: `Welcome to NIVARA, ${fullName}!`,
        html: emailHtml
      });
    } catch (emailError) {
      console.error("[v0] Failed to send welcome email:", emailError);
    }

    // Send notification to admins about new user registration
    try {
      // Get active admin emails
      const adminEmailsResult: any = await sql`
        SELECT email FROM admin_emails WHERE is_active = true
      `
      
      const adminEmails = adminEmailsResult.map((row: any) => row.email)
      
      if (adminEmails.length > 0) {
        const emailHtml = generateNewUserNotificationEmail({ 
          full_name: fullName, 
          email,
          phone
        });
        
        await sendEmail({
          to: adminEmails,
          subject: `New User Registration: ${fullName}`,
          html: emailHtml
        });
      }
    } catch (adminEmailError) {
      console.error("[v0] Failed to send admin notification for new user:", adminEmailError);
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Sign up error:", error)
    return { error: "Failed to create account" }
  }
}

export async function signIn(formData: FormData) {
  const rawEmail = formData.get("email") as string
  const rawPassword = formData.get("password") as string

  // Sanitize inputs
  const email = validateAndSanitizeEmail(rawEmail)
  const password = sanitizeInput(rawPassword)

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    const user = await getUserByEmail(email)

    if (!user) {
      return { error: "Invalid email or password" }
    }

    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      return { error: "Invalid email or password" }
    }

    // Create session
    const token = await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Set secure session cookie
    const cookieStore = await cookies()
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/"
    })

    return { success: true }
  } catch (error) {
    console.error("[v0] Sign in error:", error)
    return { error: "Failed to sign in" }
  }
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
  redirect("/")
}