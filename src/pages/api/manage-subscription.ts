export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, welcome, changelog, product, marketing, service } = body;

    if (!email) {
      return new Response(JSON.stringify({ success: false, error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Subscription preferences update received:', {
      email,
      preferences: { welcome, changelog, product, marketing, service }
    });

    // Initialize Resend
    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    // Send notification to administrators about preference changes
    try {
      const result = await resend.emails.send({
        from: import.meta.env.WEBSITE_EMAIL || 'website@underlandportal.com',
        to: 'subscribers@underlandportal.com',
        subject: 'Subscription Preferences Updated - Underland View',
        html: `
          <h2>Subscription Preferences Updated</h2>
          <p>A user has updated their subscription preferences:</p>
          <ul>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Welcome emails:</strong> ${welcome ? 'Yes' : 'No'}</li>
            <li><strong>Changelog updates:</strong> ${changelog ? 'Yes' : 'No'}</li>
            <li><strong>Product notifications:</strong> ${product ? 'Yes' : 'No'}</li>
            <li><strong>Marketing emails:</strong> ${marketing ? 'Yes' : 'No'}</li>
            <li><strong>Service updates:</strong> ${service ? 'Yes' : 'No'}</li>
          </ul>
          <hr>
          <p><small>Updated via Underland View subscription management on ${new Date().toLocaleString()}</small></p>
        `,
      });
      
      console.log('Subscription preference update notification sent via Resend!', result);
    } catch (emailError) {
      console.error('Failed to send preference update notification via Resend:', emailError);
      // Don't fail the entire request if email notification fails
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Subscription preferences updated successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Error updating subscription preferences:', err);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to update preferences' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};