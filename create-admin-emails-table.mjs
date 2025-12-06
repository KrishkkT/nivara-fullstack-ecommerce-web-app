import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function createAdminEmailsTable() {
  try {
    // Create the admin_emails table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_emails (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('✅ Admin emails table created successfully!');
    
    // Insert default admin email if none exist
    const existingEmails = await sql`SELECT COUNT(*) as count FROM admin_emails`;
    if (existingEmails[0].count === '0') {
      const defaultEmail = 'krishthakker508@gmail.com';
      await sql`
        INSERT INTO admin_emails (email, is_active) 
        VALUES (${defaultEmail}, true)
        ON CONFLICT (email) DO NOTHING
      `;
      console.log(`✅ Default email ${defaultEmail} inserted`);
    } else {
      console.log('ℹ️  Admin emails table already has data');
    }
    
    // Show current admin emails
    const adminEmails = await sql`SELECT * FROM admin_emails ORDER BY created_at DESC`;
    console.log('Current admin emails:');
    adminEmails.forEach(email => {
      console.log(`  - ${email.email} (${email.is_active ? 'active' : 'inactive'})`);
    });
  } catch (error) {
    console.error('❌ Error creating admin emails table:', error.message);
  }
}

createAdminEmailsTable();