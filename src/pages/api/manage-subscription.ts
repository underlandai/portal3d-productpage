export const prerender = false;

import type { APIRoute } from 'astro';

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

    // TODO: In a real implementation, you would:
    // 1. Validate the email exists in your database
    // 2. Update the user's subscription preferences
    // 3. Sync with your email service provider (Resend audiences)
    
    // For now, we'll simulate a successful update
    console.log(`Updated subscription preferences for ${email}:`, {
      welcome,
      changelog, 
      product,
      marketing,
      service
    });

    // TODO: Integrate with Resend API to manage audiences/tags
    // You might want to:
    // - Add/remove user from different audience lists in Resend
    // - Update user tags based on preferences
    // - Store preferences in a database

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