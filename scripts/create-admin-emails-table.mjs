import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function createAdminEmailsTable() {
  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '017-add-admin-emails-table.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL content into separate statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim() && !statement.startsWith('--')) {
        console.log('Executing:', statement.substring(0, 50) + '...');
        // Use sql.query for raw SQL execution
        await sql.query(statement);
      }
    }
    
    console.log('Admin emails table created successfully!');
  } catch (error) {
    console.error('Error creating admin emails table:', error);
  }
}

createAdminEmailsTable();