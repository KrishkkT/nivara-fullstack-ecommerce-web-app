import { sql } from "../lib/db";
import bcrypt from "bcryptjs";

async function migratePasswords() {
  try {
    console.log("Starting password migration...");
    
    // Get all users with their current password hashes
    const users: any = await sql`
      SELECT id, email, password_hash FROM users
    `;
    
    console.log(`Found ${users.length} users to migrate`);
    
    let migratedCount = 0;
    
    for (const user of users) {
      try {
        // Check if the password is already bcrypt hashed (bcrypt hashes start with $2)
        if (user.password_hash.startsWith('$2')) {
          console.log(`User ${user.email} already has bcrypt hash, skipping...`);
          continue;
        }
        
        // If it's an old SHA-256 hash, we need to rehash it with bcrypt
        // Since we don't have the plain text password, we'll need to prompt users to reset their passwords
        // For now, we'll mark these accounts as needing password reset
        
        // Update the user record to indicate password needs reset
        await sql`
          UPDATE users 
          SET password_hash = 'RESET_REQUIRED', 
              updated_at = CURRENT_TIMESTAMP 
          WHERE id = ${user.id}
        `;
        
        console.log(`Marked user ${user.email} for password reset`);
        migratedCount++;
      } catch (error) {
        console.error(`Error migrating user ${user.email}:`, error);
      }
    }
    
    console.log(`Migration completed. ${migratedCount} users marked for password reset.`);
    console.log("Users will need to reset their passwords on next login.");
    
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

// Run the migration
migratePasswords().then(() => {
  console.log("Password migration script finished");
  process.exit(0);
}).catch((error) => {
  console.error("Password migration script failed:", error);
  process.exit(1);
});