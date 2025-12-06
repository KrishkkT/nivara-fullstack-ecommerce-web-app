import { sql } from "./db"

export interface User {
  id: number
  email: string
  full_name: string
  phone?: string
  role: string
  created_at: Date
}

// Use Web Crypto API instead of bcryptjs for better compatibility in edge environments
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

export async function createUser(email: string, password: string, fullName: string, phone?: string): Promise<User> {
  const passwordHash = await hashPassword(password)

  const result = await sql`
    INSERT INTO users (email, password_hash, full_name, phone)
    VALUES (${email}, ${passwordHash}, ${fullName}, ${phone})
    RETURNING id, email, full_name, phone, role, created_at
  `

  return result[0] as User
}

export async function getUserByEmail(email: string): Promise<(User & { password_hash: string }) | null> {
  const result = await sql`
    SELECT id, email, password_hash, full_name, phone, role, created_at
    FROM users
    WHERE email = ${email}
  `

  return (result[0] as User & { password_hash: string }) || null
}

export async function getUserById(id: number): Promise<User | null> {
  const result = await sql`
    SELECT id, email, full_name, phone, role, created_at
    FROM users
    WHERE id = ${id}
  `

  return (result[0] as User) || null
}
