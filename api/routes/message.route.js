import express from "express";
import { sendMessage } from "../controllers/message.controller.js";
import transporter from "../config/email.js";

const router = express.Router();

router.post("/", sendMessage);

router.get('/test-smtp', async (req, res) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Missing email credentials in environment');
    }

    const testMsg = {
      from: `"Test Sender" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || 'your-email@example.com',
      subject: 'SMTP Test',
      text: `Test sent at ${new Date().toISOString()}`
    };

    const info = await transporter.sendMail(testMsg);
    
    res.json({
      success: true,
      message: `Test email sent to ${testMsg.to}`,
      messageId: info.messageId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'SMTP test failed',
      error: error.message,
      credentials: {
        user: process.env.EMAIL_USER ? '*****' : 'MISSING',
        server: `${transporter.options.host}:${transporter.options.port}`
      }
    });
  }
});

// Add this export statement (choose either default or named export):

// Option 1: Default export (recommended for single router files)
export default router;

// OR Option 2: Named export
// export { router as messageRoutes };