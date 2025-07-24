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
    const additionalConsent = formData.get('additionalConsent') === 'on' ? 'Yes' : 'No';

    // Use MailHog for local development, Gmail for production
    const isDevelopment = !process.env.GMAIL_ADDRESS || !process.env.GMAIL_APP_PASSWORD;
    
    console.log('Form data received:', {
      firstName, lastName, phoneNumber, companyName, 
      companySize, companyProduct, email, message, additionalConsent
    });
    
    console.log('Email configuration:', {
      isDevelopment,
      host: isDevelopment ? 'mailhog' : 'smtp.gmail.com',
      port: isDevelopment ? 1025 : 465
    });

    // Configure Nodemailer transport
    const transporter = nodemailer.createTransport(
      isDevelopment
        ? ({
            host: 'mailhog',
            port: 1025,
            ignoreTLS: true,
            secure: false,
            auth: false,
          } as any)
        : {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: process.env.GMAIL_ADDRESS,
              pass: process.env.GMAIL_APP_PASSWORD,
            },
          }
    );
      
      

    // Send mail
    console.log('Attempting to send email...');
    try {
      const result = await transporter.sendMail({
        from: isDevelopment 
          ? '"Website" <test@localhost>' 
          : `"Website" <${process.env.GMAIL_ADDRESS}>`,
        to: 'oli@underland.cloud',
        subject: 'New form submission',
        text: `First Name: ${firstName}\nLast Name: ${lastName}\nPhone Number: ${phoneNumber}\nCompany Name: ${companyName}\nCompany Size: ${companySize}\nCompany Product: ${companyProduct}\nEmail: ${email}\nMessage: ${message}\nAgrees to receive other communications: ${additionalConsent}`,
      });
      
      console.log('Email sent successfully!', result);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      throw emailError; // Re-throw to be caught by outer try-catch
    }

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
