"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required")
}

async function createSession(user: { id: number; email: string; role: string; full_name: string }) {
  const token = await new SignJWT({ userId: user.id, email: user.email, role: user.role, fullName: user.full_name })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer('nivara-app')
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(JWT_SECRET))

  const cookieStore = cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
}

export async function signIn(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Simple validation
    if (!email || !password) {
      return { error: "Email and password required" }
    }

    // Get user from database
    const result = await sql`
      SELECT id, email, password_hash, role, full_name FROM users WHERE email = ${email}
    `

    if (result.length === 0) {
      return { error: "Invalid credentials" }
    }

    const user = result[0]

    // Check password
    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      return { error: "Invalid credentials" }
    }

    await createSession(user)

    // Redirect to account
    redirect("/account")
  } catch (error) {
    console.error("Sign in error:", error)
    return { error: "Failed to sign in" }
  }
}

export async function signUp(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string

    // Simple validation
    if (!email || !password || !fullName) {
      return { error: "All fields required" }
    }

    if (password.length < 8) {
      return { error: "Password too short" }
    }

    // Check if user exists
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existing.length > 0) {
      return { error: "Email taken" }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const result = await sql`
      INSERT INTO users (email, password_hash, full_name)
      VALUES (${email}, ${passwordHash}, ${fullName})
      RETURNING id, email, role, full_name
    `

    const user = result[0]

    await createSession(user)

    // Redirect to account
    redirect("/account")
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "Failed to create account" }
  }
}

export async function signOut() {
  "use server"
  const cookieStore = cookies()
  cookieStore.delete('session')
  redirect("/")
}