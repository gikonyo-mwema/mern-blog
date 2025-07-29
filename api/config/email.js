import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('Email Config:', {
  user: process.env.EMAIL_USER ? '*****' : 'MISSING',
  pass: process.env.EMAIL_PASS ? '*****' : 'MISSING',
  admin: process.env.ADMIN_EMAIL
});

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error('❌ Email credentials missing in .env file');
}

const transporter = nodemailer.createTransport({
  host: "mail.ecodeed.co.ke",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection
transporter.verify((error) => {
  if (error) {
    console.error('❌ SMTP Connection Failed:', error.message);
  } else {
    console.log('✅ SMTP Connection Verified');
    
    // Test email in development
    if (process.env.NODE_ENV === 'development') {
      transporter.sendMail({
        from: `"Test" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: 'SMTP Test',
        text: 'This is a test email from your server'
      })
      .then(info => console.log('📧 Test email sent:', info.messageId))
      .catch(err => console.error('Test email failed:', err));
    }
  }
});

export default transporter;