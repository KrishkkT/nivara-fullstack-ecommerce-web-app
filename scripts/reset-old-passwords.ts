/**
 * Script to reset old SHA-256 password hashes and require users to reset their passwords
 * 
 * This script marks all existing user accounts with old password hashes as requiring
 * a password reset. Users will see a message asking them to reset their password
 * when they try to log in.
 */

import { sql } from "../lib/db";
import { createHash } from "crypto";

async function resetOldPasswords() {
  try {
    console.log("Starting password reset process for old accounts...");
    
    // Get all users with their current password hashes
    const users: any = await sql`
      SELECT id, email, password_hash FROM users
    `;
    
    console.log(`Found ${users.length} users in the database`);
    
    let resetCount = 0;
    
    for (const user of users) {
      try {
        // Check if the password hash looks like a SHA-256 hash (64 hex characters)
        // bcrypt hashes start with $2, so we're looking for old SHA-256 hashes
        if (user.password_hash.length === 64 && /^[a-f0-9]+$/.test(user.password_hash)) {
          // This looks like an old SHA-256 hash, mark for reset
          await sql`
            UPDATE users 
            SET password_hash = 'RESET_REQUIRED', 
                updated_at = CURRENT_TIMESTAMP 
            WHERE id = ${user.id}
          `;
          
          console.log(`Marked user ${user.email} for password reset`);
          resetCount++;
        } else if (user.password_hash === 'RESET_REQUIRED') {
          // Already marked for reset
          console.log(`User ${user.email} already marked for password reset`);
        } else if (user.password_hash.startsWith('$2')) {
          // Already using bcrypt
          console.log(`User ${user.email} already using bcrypt (OK)`);
        } else {
          // Unknown hash format
          console.log(`User ${user.email} has unknown hash format: ${user.password_hash.substring(0, 20)}...`);
        }
      } catch (error) {
        console.error(`Error processing user ${user.email}:`, error);
      }
    }
    
    console.log(`\nProcess completed:`);
    console.log(`- ${resetCount} users marked for password reset`);
    console.log(`- Users will need to use the password reset feature to set new passwords`);
    console.log(`- New users will automatically get bcrypt hashed passwords`);
    
    console.log(`\nNext steps:`);
    console.log(`1. Deploy the updated authentication code`);
    console.log(`2. Inform affected users they need to reset their passwords`);
    console.log(`3. Users can use the "Forgot Password" link on the login page`);
    
  } catch (error) {
    console.error("Password reset process failed:", error);
    process.exit(1);
  }
}

// Run the reset process
resetOldPasswords().then(() => {
  console.log("\nPassword reset process finished successfully");
  process.exit(0);
}).catch((error) => {
  console.error("\nPassword reset process failed:", error);
  process.exit(1);
});