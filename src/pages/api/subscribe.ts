export const prerender = false;

// src/pages/api/subscribe.ts
import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse form data
    const formData = await request.formData();
    const email = formData.get('email')?.toString() || '';

    if (!email) {
      return new Response(JSON.stringify({ success: false, error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Use MailHog for local development, Gmail for production
    const isDevelopment = !process.env.GMAIL_ADDRESS || !process.env.GMAIL_APP_PASSWORD;
    
    console.log('Newsletter subscription received:', { email });

    // Configure Nodemailer transport
    const transporter = nodemailer.createTransport(
      isDevelopment
        ? {
            host: 'mailhog',
            port: 1025,
            ignoreTLS: true,
            secure: false,
            auth: false,
          } as any
          }
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

    // Send notification email to your team
    await transporter.sendMail({
      from: isDevelopment 
        ? '"Newsletter" <test@localhost>' 
        : `"Newsletter" <${process.env.GMAIL_ADDRESS}>`,
      to: 'sales@underland.cloud',
      subject: 'New Newsletter Subscription',
      text: `A new user has subscribed to the newsletter:\n\nEmail: ${email}\n\nSubscribed via: Underland Cloud Blog`,
      html: `
        <h2>New Newsletter Subscription</h2>
        <p>A new user has subscribed to the newsletter:</p>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Source:</strong> Underland Cloud Blog</li>
          <li><strong>Date:</strong> ${new Date().toLocaleString()}</li>
        </ul>
      `,
    });

    // Optional: Send welcome email to subscriber
    if (!isDevelopment) {
      await transporter.sendMail({
        from: `"Underland Cloud" <${process.env.GMAIL_ADDRESS}>`,
        to: email,
        subject: 'Welcome to Underland Cloud Updates!',
        html: `
          <h2>Welcome to Underland Cloud!</h2>
          <p>Thank you for subscribing to our newsletter. You'll now receive updates about:</p>
          <ul>
            <li>New blog posts and insights</li>
            <li>Product updates and features</li>
            <li>Resource industry innovations</li>
            <li>3D visualisation developments</li>
          </ul>
          <p>We're excited to keep you in the loop!</p>
          <p>Best regards,<br>The Underland Cloud Team</p>
          <hr>
          <p><small>If you didn't subscribe to this newsletter, you can safely ignore this email.</small></p>
        `,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error processing newsletter subscription:', err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};