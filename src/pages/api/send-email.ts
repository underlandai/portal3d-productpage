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

    // Send email using Resend
    console.log('Attempting to send email via Resend...');
    try {
      const result = await resend.emails.send({
        from: import.meta.env.WEBSITE_EMAIL || 'website@underland.cloud',
        to: 'oli@underland.cloud',
        subject: 'New Contact Form Submission - Underland Cloud',
        html: `
          <h2>New Contact Form Submission</h2>
          <p>A new contact form submission has been received:</p>
          <ul>
            <li><strong>First Name:</strong> ${firstName}</li>
            <li><strong>Last Name:</strong> ${lastName}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone Number:</strong> ${phoneNumber}</li>
            <li><strong>Company Name:</strong> ${companyName}</li>
            <li><strong>Company Size:</strong> ${companySize}</li>
            <li><strong>Company Product:</strong> ${companyProduct}</li>
            <li><strong>Additional Communications Consent:</strong> ${additionalConsent}</li>
          </ul>
          <h3>Message:</h3>
          <p>${message}</p>
          <hr>
          <p><small>Submitted via Underland Cloud contact form on ${new Date().toLocaleString()}</small></p>
        `,
      });
      
      console.log('Email sent successfully via Resend!', result);
    } catch (emailError) {
      console.error('Failed to send email via Resend:', emailError);
      
      // Log detailed error information
      if (emailError && typeof emailError === 'object') {
        console.error('Error details:', {
          message: emailError.message,
          status: emailError.status,
          statusText: emailError.statusText,
          name: emailError.name,
          cause: emailError.cause
        });
      }
      
      throw emailError;
    }

    // Send welcome email if user consented to marketing communications
    if (additionalConsent === 'Yes' && email) {
      console.log('User consented to marketing - sending welcome email to:', email);
      try {
        const welcomeEmailHtml = await render(WelcomeEmail({ userFirstName: firstName }));
        
        const welcomeResult = await resend.emails.send({
          from: import.meta.env.FROM_EMAIL || 'oliver.mowbray@underland.cloud',
          to: email,
          subject: 'Welcome to Underland Cloud!',
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
