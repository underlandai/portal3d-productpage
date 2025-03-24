// src/pages/api/send-email.ts
import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

// If using environment variables, set them in Vercel project settings
// e.g. process.env.SMTP_HOST, process.env.SMTP_USER, process.env.SMTP_PASS, etc.

export const post: APIRoute = async ({ request }) => {
  try {
    // Parse form data
    const formData = await request.formData();
    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const message = formData.get('message')?.toString() || '';

    // Configure Nodemailer transport
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use TLS
        auth: {
          user: process.env.GMAIL_ADDRESS, 
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });
      

    // Send mail
    await transporter.sendMail({
      from: `"Website" <${process.env.GMAIL_ADDRESS}>`,
      to: 'sales@lichen.com.au', // or pull from form
      subject: 'New form submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error sending email:', err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
