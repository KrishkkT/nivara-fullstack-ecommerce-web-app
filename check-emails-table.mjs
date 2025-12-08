import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function checkAdminEmailsTable() {
  try {
    // Check if admin_emails table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'admin_emails'
      );
    `;
    
    console.log('Table exists:', tableExists[0].exists);
    
    if (tableExists[0].exists) {
      // Get all admin emails
      const adminEmails = await sql`SELECT * FROM admin_emails`;
      console.log('Admin emails:', adminEmails);
      
      // Check if the required admin emails are present
      const requiredEmails = ['krishthakker508@gmail.com', 'nivarajewel@gmail.com'];
      
      for (const email of requiredEmails) {
        const emailExists = adminEmails.some(row => row.email === email);
        console.log(`Email ${email} exists:`, emailExists);
        
        if (!emailExists) {
          // Insert missing email
          await sql`INSERT INTO admin_emails (email, is_active) VALUES (${email}, true) ON CONFLICT (email) DO UPDATE SET is_active = true`;
          console.log(`Added/updated email: ${email}`);
        }
      }
    } else {
      console.log('Admin emails table does not exist');
    }
  } catch (error) {
    console.error('Error checking admin emails table:', error.message);
  }
}

checkAdminEmailsTable();