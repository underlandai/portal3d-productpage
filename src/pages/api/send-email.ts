export const prerender = false;

// src/pages/api/send-email.ts
import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { WelcomeEmail } from '../../emails/welcome-email';

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

    console.log('Form data received:', {
      firstName, lastName, phoneNumber, companyName, 
      companySize, companyProduct, email, message, additionalConsent
    });

    // Initialize Resend
    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    // No need to send notification email - Slack webhook handles notifications
    // Contact form submissions will trigger contact.created webhook if user consents to marketing
    console.log('Contact form processed - notifications handled via Slack webhook');

    // Create contact and send welcome email if user consented to marketing communications
    if (additionalConsent === 'Yes' && email) {
      console.log('User consented to marketing - creating contact and sending welcome email to:', email);
      
      // Create contact in Resend (this will trigger contact.created webhook)
      try {
        const contactResult = await resend.contacts.create({
          email: email,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          audienceId: import.meta.env.RESEND_AUDIENCE_ID,
        });
        
        console.log('Contact created successfully!', contactResult);
      } catch (contactError) {
        console.error('Failed to create contact (non-critical):', contactError);
        // Don't throw here - we still want to send the welcome email
      }
      
      // Send welcome email
      try {
        const welcomeEmailHtml = await render(WelcomeEmail({ userFirstName: firstName }));
        
        const welcomeResult = await resend.emails.send({
          from: import.meta.env.FROM_EMAIL || 'oliver.mowbray@underlandportal.com',
          to: email,
          subject: 'Welcome to Underland View!',
          html: welcomeEmailHtml,
        });
        
        console.log('Welcome email sent successfully!', welcomeResult);
      } catch (welcomeError) {
        console.error('Failed to send welcome email (non-critical):', welcomeError);
        // Don't throw here - main contact form was successful
      }
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
