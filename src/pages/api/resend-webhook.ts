export const prerender = false;

// src/pages/api/resend-webhook.ts
import type { APIRoute } from 'astro';
import { Webhook } from 'svix';

export const POST: APIRoute = async ({ request }) => {
  try {
    const slackWebhookUrl = import.meta.env.SLACK_WEBHOOK_URL;
    const webhookSecret = import.meta.env.RESEND_WEBHOOK_SIGNING_SECRET;
    
    if (!slackWebhookUrl) {
      throw new Error('SLACK_WEBHOOK_URL environment variable is not set');
    }
    
    if (!webhookSecret) {
      throw new Error('RESEND_WEBHOOK_SIGNING_SECRET environment variable is not set');
    }

    // Get the raw body and headers for verification
    const payload = await request.text();
    const svixId = request.headers.get('svix-id');
    const svixTimestamp = request.headers.get('svix-timestamp');
    const svixSignature = request.headers.get('svix-signature');
    
    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response('Missing required webhook headers', { status: 401 });
    }

    const headers = {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature
    };

    // Verify the webhook signature using Svix (Resend's recommended approach)
    const webhook = new Webhook(webhookSecret);
    let body: { type: string; data: any };
    
    try {
      body = webhook.verify(payload, headers) as { type: string; data: any };
    } catch (error) {
      console.error('Webhook verification failed:', error);
      return new Response('Invalid signature', { status: 401 });
    }

    const { type, data } = body;

    // Format message based on event type
    let slackMessage = '';
    let emoji = '📧';
    
    switch (type) {
      // Contact Events
      case 'contact.created':
        emoji = '👤';
        slackMessage = `New contact created: ${data.email || data.name || 'Unknown'} ${data.first_name ? `(${data.first_name} ${data.last_name || ''})` : ''}`;
        break;
      case 'contact.updated':
        emoji = '✏️';
        slackMessage = `Contact updated: ${data.email || data.name || 'Unknown'} ${data.first_name ? `(${data.first_name} ${data.last_name || ''})` : ''}`;
        break;
      case 'contact.deleted':
        emoji = '🗑️';
        slackMessage = `Contact deleted: ${data.email || data.name || 'Unknown'}`;
        break;
      
      // Domain Events
      case 'domain.created':
        emoji = '🌐';
        slackMessage = `New domain created: ${data.name || data.domain || 'Unknown domain'}`;
        break;
      case 'domain.updated':
        emoji = '🔄';
        slackMessage = `Domain updated: ${data.name || data.domain || 'Unknown domain'}`;
        break;
      case 'domain.deleted':
        emoji = '🚫';
        slackMessage = `Domain deleted: ${data.name || data.domain || 'Unknown domain'}`;
        break;
      
      // Email Events
      case 'email.sent':
        emoji = '✅';
        slackMessage = `Email sent to ${data.to?.join(', ') || 'Unknown'} - Subject: "${data.subject || 'No subject'}"`;
        break;
      case 'email.delivered':
        emoji = '📬';
        slackMessage = `Email delivered to ${data.to?.join(', ') || 'Unknown'} - Subject: "${data.subject || 'No subject'}"`;
        break;
      case 'email.bounced':
        emoji = '❌';
        slackMessage = `Email bounced to ${data.to?.join(', ') || 'Unknown'} - Subject: "${data.subject || 'No subject'}"`;
        break;
      case 'email.complained':
        emoji = '⚠️';
        slackMessage = `Spam complaint from ${data.to?.join(', ') || 'Unknown'} - Subject: "${data.subject || 'No subject'}"`;
        break;
      case 'email.opened':
        emoji = '👀';
        slackMessage = `Email opened by ${data.to?.join(', ') || 'Unknown'} - Subject: "${data.subject || 'No subject'}"`;
        break;
      case 'email.clicked':
        emoji = '🔗';
        slackMessage = `Link clicked in email to ${data.to?.join(', ') || 'Unknown'} - Subject: "${data.subject || 'No subject'}"`;
        break;
      case 'email.delivery_delayed':
        emoji = '⏰';
        slackMessage = `Email delivery delayed to ${data.to?.join(', ') || 'Unknown'} - Subject: "${data.subject || 'No subject'}"`;
        break;
      case 'email.failed':
        emoji = '💥';
        slackMessage = `Email failed to ${data.to?.join(', ') || 'Unknown'} - Subject: "${data.subject || 'No subject'}"`;
        break;
      case 'email.scheduled':
        emoji = '📅';
        slackMessage = `Email scheduled for ${data.to?.join(', ') || 'Unknown'} - Subject: "${data.subject || 'No subject'}"`;
        break;
      
      default:
        emoji = '📧';
        slackMessage = `Unknown event: ${type} - Data: ${JSON.stringify(data)}`;
    }

    // Send notification to Slack
    const slackPayload = {
      text: `${emoji} Underland Portal3D ${type.split('.')[0].charAt(0).toUpperCase() + type.split('.')[0].slice(1)} Update`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${emoji} ${slackMessage}`
          }
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Event: ${type} | ID: ${data.email_id || data.contact_id || data.domain_id || 'N/A'} | Time: ${new Date().toLocaleString()}`
            }
          ]
        }
      ]
    };

    const slackResponse = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackPayload),
    });

    if (!slackResponse.ok) {
      throw new Error(`Slack API error: ${slackResponse.status}`);
    }

    console.log('Webhook processed successfully:', { type, emailId: data.email_id });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ success: false, error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};