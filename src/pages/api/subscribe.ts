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

    // Create contact in Resend (this will trigger contact.created webhook)
    console.log('Creating contact in Resend...');
    try {
      const contactResult = await resend.contacts.create({
        email: email,
        audienceId: import.meta.env.RESEND_AUDIENCE_ID, // You'll need to get this from Resend dashboard
      });
      
      console.log('Contact created successfully!', contactResult);
    } catch (contactError) {
      console.error('Failed to create contact (non-critical):', contactError);
      // Don't throw here - we still want to send the notification email
    }

    // Send notification email to subscribers team
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
          <p><em>Note: Contact has been created in Resend audience for future email campaigns.</em></p>
        `,
      });
      
      console.log('Newsletter subscription notification sent successfully!', notificationResult);
    } catch (emailError) {
      console.error('Failed to send newsletter subscription notification:', emailError);
      throw emailError;
    }

    console.log('Newsletter subscription processed - contact created in Resend audience');

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