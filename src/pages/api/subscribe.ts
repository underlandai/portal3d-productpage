export const prerender = false;

// src/pages/api/subscribe.ts
import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { WelcomeEmail } from '../../emails/welcome-email';

// Extract potential first name from email address
function extractFirstNameFromEmail(email: string): string | undefined {
  const localPart = email.split('@')[0];
  
  // Common email patterns to extract names from
  if (localPart.includes('.')) {
    // Handle formats like "john.doe", "jane.smith"
    const parts = localPart.split('.');
    const firstPart = parts[0];
    return capitalizeFirstLetter(firstPart);
  } else if (localPart.includes('_')) {
    // Handle formats like "john_doe", "jane_smith"
    const parts = localPart.split('_');
    const firstPart = parts[0];
    return capitalizeFirstLetter(firstPart);
  } else if (localPart.length > 2) {
    // Use the whole local part if it looks like a name (longer than 2 chars)
    return capitalizeFirstLetter(localPart);
  }
  
  return undefined;
}

function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

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

    // Send welcome email to the subscriber
    try {
      const extractedFirstName = extractFirstNameFromEmail(email);
      const welcomeEmailHtml = await render(WelcomeEmail({ userFirstName: extractedFirstName }));
      
      const welcomeResult = await resend.emails.send({
        from: import.meta.env.FROM_EMAIL || 'oliver.mowbray@underland.cloud',
        to: email,
        subject: 'Welcome to Underland Cloud!',
        html: welcomeEmailHtml,
      });
      
      console.log('Welcome email sent successfully to newsletter subscriber!', welcomeResult);
    } catch (welcomeError) {
      console.error('Failed to send welcome email to newsletter subscriber (non-critical):', welcomeError);
      // Don't throw here - main subscription was successful
    }

    console.log('Newsletter subscription processed - contact created in Resend audience and welcome email sent');

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