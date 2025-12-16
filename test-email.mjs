import dotenv from 'dotenv';
import { sendEmail } from './lib/email.js';

// Load environment variables
dotenv.config();

async function testEmail() {
  console.log('Testing email functionality...');
  
  try {
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Email',
      html: '<h1>Test Email</h1><p>This is a test email from NIVARA.</p>'
    });
    
    console.log('Email test result:', result);
  } catch (error) {
    console.error('Email test failed:', error);
  }
}

testEmail();