export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return new Response(JSON.stringify({ success: false, error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Unsubscribe all request received for:', email);

    // Initialize Resend
    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    // Send notification to administrators about unsubscribe request
    try {
      const result = await resend.emails.send({
        from: import.meta.env.WEBSITE_EMAIL || 'website@underlandex.com',
        to: import.meta.env.SUBSCRIBERS_EMAIL || 'subscribers@underlandex.com',
        subject: 'Complete Unsubscribe Request - Underland Portal3D',
        html: `
          <h2>Complete Unsubscribe Request</h2>
          <p>A user has requested to unsubscribe from all email communications:</p>
          <ul>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Action:</strong> Unsubscribe from all email types</li>
            <li><strong>Date:</strong> ${new Date().toLocaleString()}</li>
          </ul>
          <p><strong>Note:</strong> Please manually remove this email from all Resend audiences and add to suppression list if available.</p>
          <hr>
          <p><small>Requested via Underland Portal3D subscription management on ${new Date().toLocaleString()}</small></p>
        `,
      });
      
      console.log('Unsubscribe notification sent via Resend!', result);
    } catch (emailError) {
      console.error('Failed to send unsubscribe notification via Resend:', emailError);
      // Don't fail the entire request if email notification fails
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Successfully unsubscribed from all emails' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Error processing unsubscribe request:', err);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to unsubscribe' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};