import { neon, neonConfig } from "@neondatabase/serverless"
import { Pool } from "@neondatabase/serverless"

// Configure neon for better performance
neonConfig.fetchConnectionCache = true
neonConfig.pipelineConnect = "password"

// Create a pool for better connection management
let pool: Pool | null = null

function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set")
    }
    
    pool = new Pool({ connectionString: process.env.DATABASE_URL })
  }
  return pool
}

// Export both pooled and direct connection options
export const sql = ((...args: any[]) => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set")
  }
  
  const sqlInstance = neon(process.env.DATABASE_URL)
  // @ts-ignore
  return sqlInstance(...args)
}) as ReturnType<typeof neon>

// Pooled connection for better performance with multiple queries
export async function pooledQuery(query: string, params: any[] = []) {
  const pool = getPool()
  const client = await pool.connect()
  
  try {
    const result = await client.query(query, params)
    return result
  } finally {
    client.release()
  }
}