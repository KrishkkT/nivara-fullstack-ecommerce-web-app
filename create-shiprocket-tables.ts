import { sql } from "@/lib/db";
import fs from "fs";

async function createShiprocketTables() {
  try {
    console.log("Creating Shiprocket tables...");
    
    // Read the SQL file
    const sqlScript = fs.readFileSync("./scripts/021-add-shiprocket-tables.sql", "utf8");
    
    // Split the script into individual statements
    const statements = sqlScript
      .split(";")
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        console.log("Executing:", statement.substring(0, 100) + "...");
        await sql.unsafe(statement);
      }
    }
    
    console.log("Shiprocket tables created successfully!");
  } catch (error) {
    console.error("Error creating Shiprocket tables:", error);
  }
}

// Run the function
createShiprocketTables().catch(console.error);