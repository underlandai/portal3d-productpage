export const prerender = false;

// src/pages/api/send-email.ts
import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse form data
    const formData = await request.formData();
    const firstName = formData.get('firstName')?.toString() || '';
    const lastName = formData.get('lastName')?.toString() || '';
    const phoneNumber = formData.get('phoneNumber')?.toString() || '';
    const companyName = formData.get('companyName')?.toString() || '';
    const companySize = formData.get('companySize')?.toString() || '';
    const companyProduct = formData.get('companyProduct')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const message = formData.get('message')?.toString() || '';

    // Configure Nodemailer transport
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
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
      text: `First Name: ${firstName}\nLast Name: ${lastName}\nPhone Number: ${phoneNumber}\nCompany Name: ${companyName}\nCompany Size: ${companySize}\nCompany Product: ${companyProduct}\nEmail: ${email}\nMessage: ${message}`,
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
