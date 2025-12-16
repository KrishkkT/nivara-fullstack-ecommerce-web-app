import { createHash } from "crypto"

// Hash password using SHA-256
export async function hashPassword(password: string): Promise<string> {
  return createHash('sha256').update(password).digest('hex')
}

// Verify password using SHA-256
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashedPassword = createHash('sha256').update(password).digest('hex')
  return hashedPassword === hash
}