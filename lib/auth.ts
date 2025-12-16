import bcrypt from "bcryptjs"

// Hash password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

// Verify password using bcrypt
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}