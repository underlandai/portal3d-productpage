export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { WelcomeEmail } from '../../emails/welcome-email';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, firstName } = body;

    if (!email) {
      return new Response(JSON.stringify({ success: false, error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Welcome email request received:', { email, firstName });

    // Initialize Resend
    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    // Render the React Email template
    const emailHtml = await render(WelcomeEmail({ userFirstName: firstName }));

    // Send welcome email using Resend
    console.log('Sending welcome email via Resend...');
    try {
      const result = await resend.emails.send({
        from: import.meta.env.FROM_EMAIL || 'oliver.mowbray@underlandportal.com',
        to: email,
        subject: 'Welcome to Underland Portal3D!',
        html: emailHtml,
      });

      console.log('Welcome email sent successfully!', result);

      return new Response(JSON.stringify({ success: true, id: result.data?.id }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      throw emailError;
    }
  } catch (err) {
    console.error('Error sending welcome email:', err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};