import { sql } from "./db"
import bcrypt from "bcryptjs"

export interface User {
  id: number
  email: string
  full_name: string
  phone?: string
  role: string
  created_at: Date
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
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
