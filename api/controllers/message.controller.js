import Message from "../models/message.model.js";
import transporter from "../config/email.js";

// Rate limiting setup
const RATE_LIMIT = 5; // Messages per hour per IP
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  let entry = rateLimitMap.get(ip);

  if (!entry || now - entry.start > windowMs) {
    // Reset window
    entry = { count: 1, start: now };
    rateLimitMap.set(ip, entry);
    return false;
  }

  if (entry.count >= RATE_LIMIT) {
    return true;
  }

  entry.count += 1;
  return false;
}

export const sendMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const ip = req.ip;

    // Rate limiting
    if (isRateLimited(ip)) {
      return res.status(429).json({
        success: false,
        message: "Rate limit exceeded. Please try again later."
      });
    }

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Save to database
    const savedMsg = await Message.create({ name, email, subject, message });

    // Send email to company
    await transporter.sendMail({
      from: `"Website Contact Form" <contact@ecodeed.co.ke>`,
      replyTo: email,
      to: "contact@ecodeed.co.ke",
      subject: `New Contact: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <p><strong>New contact form submission:</strong></p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Subject:</strong> ${subject}</li>
        </ul>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    // Send confirmation to user
    await transporter.sendMail({
      from: `"Ecodeed Team" <contact@ecodeed.co.ke>`,
      to: email,
      subject: "We've received your message",
      text: `Hi ${name},\n\nThank you for contacting Ecodeed!\nWe have received your message and will respond shortly.\n\nBest regards,\nThe Ecodeed Team`,
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for contacting Ecodeed! We have received your message 
        and will respond shortly.</p>
        <p>Best regards,<br>The Ecodeed Team</p>
      `
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: savedMsg
    });
  } catch (error) {
    // Add this to the error handler:
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });
    }
    console.error("Message sending error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

