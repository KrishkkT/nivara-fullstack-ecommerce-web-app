import { neon } from "@neondatabase/serverless";

async function runMigration() {
  try {
    console.log("Adding is_sold_out column to products table...");
    
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    
    const sql = neon(process.env.DATABASE_URL);
    
    // Add is_sold_out column to products table
    await sql`ALTER TABLE products ADD COLUMN is_sold_out BOOLEAN DEFAULT false`;
    
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

runMigration();