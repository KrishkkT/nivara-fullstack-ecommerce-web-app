"use server"

import { cookies } from "next/headers"
import { createUser, getUserByEmail, verifyPassword } from "@/lib/auth"
import { createSession, setSessionCookie } from "@/lib/session"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"

// Simplified sign in function with server-side redirect
export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    // Get user
    const result = await sql`
      SELECT id, email, password_hash, full_name, role
      FROM users
      WHERE email = ${email}
    `

    if (result.length === 0) {
      return { error: "Invalid email or password" }
    }

    const user = result[0]

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash)
    if (!isValid) {
      return { error: "Invalid email or password" }
    }

    // Create session token
    const token = await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Set session cookie
    await setSessionCookie(token)

    // Redirect to account page (server-side redirect as per specification)
    redirect("/account")
  } catch (error) {
    return { error: "Failed to sign in" }
  }
}

// Simplified sign up function
export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string

  if (!email || !password || !fullName) {
    return { error: "All fields are required" }
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" }
  }

  try {
    // Check if user exists
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existing.length > 0) {
      return { error: "Email already registered" }
    }

    // Hash password
    const passwordHash = await import("bcryptjs").then(bcrypt => bcrypt.hash(password, 12))

    // Create user
    const userResult = await sql`
      INSERT INTO users (email, password_hash, full_name)
      VALUES (${email}, ${passwordHash}, ${fullName})
      RETURNING id, email, full_name, role
    `

    const user = userResult[0]

    // Create session
    const token = await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Set session cookie
    await setSessionCookie(token)

    // Redirect to account page (server-side redirect as per specification)
    redirect("/account")
  } catch (error) {
    return { error: "Failed to create account" }
  }
}

// Updated signOut function to use API approach
export async function signOut() {
  try {
    // Call the logout API endpoint
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Redirect to home page
    redirect("/")
  } catch (error) {
    console.error("Sign out error:", error)
    redirect("/")
  }
}