import { neon } from "@neondatabase/serverless"

// Lazy initialization - only check for DATABASE_URL when it's actually used
export const sql = ((...args: any[]) => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set")
  }
  
  const sqlInstance = neon(process.env.DATABASE_URL)
  // @ts-ignore
  return sqlInstance(...args)
}) as ReturnType<typeof neon>