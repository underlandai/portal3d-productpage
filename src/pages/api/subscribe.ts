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

    // No need to send notification email - Slack webhook handles notifications via contact.created event

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