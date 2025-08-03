export const prerender = false;

// src/pages/api/subscribe.ts
import type { APIRoute } from 'astro';
import { Resend } from 'resend';

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

    console.log('Newsletter subscription received:', { email });

    // Initialize Resend
    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    // Send notification email to subscribers team (no customer email for newsletter signup)
    console.log('Sending newsletter subscription notification to subscribers team...');
    try {
      const notificationResult = await resend.emails.send({
        from: import.meta.env.WEBSITE_EMAIL || 'website@underland.cloud',
        to: import.meta.env.SUBSCRIBERS_EMAIL || 'subscribers@underland.cloud',
        subject: 'New Newsletter Subscription - Underland Cloud',
        html: `
          <h2>New Newsletter Subscription</h2>
          <p>A new user has subscribed to the newsletter:</p>
          <ul>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Source:</strong> Underland Cloud Newsletter Form</li>
            <li><strong>Date:</strong> ${new Date().toLocaleString()}</li>
          </ul>
          <p><em>Note: No welcome email was sent to the subscriber for newsletter signups. Welcome emails are only sent for contact form marketing consent.</em></p>
        `,
      });
      
      console.log('Newsletter subscription notification sent successfully!', notificationResult);
    } catch (emailError) {
      console.error('Failed to send newsletter subscription notification:', emailError);
      throw emailError;
    }

    console.log('Newsletter subscription processed - no customer email sent (by design)');

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