import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
  Heading,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  userFirstName?: string;
}

export const WelcomeEmail = ({
  userFirstName = 'there',
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Your first steps with Underland View</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={greeting}>Hey {userFirstName},</Heading>
        <Text style={text}>
          I'm Oliver, a founder of Underland Portal and mining tech enthusiast.
          Thank you for signing up.
        </Text>
        <Text style={text}>
          We built Underland View to fix a common frustration: viewing and sharing
          subsurface models should be simple. Our goal for this tool was to create a fast and
          elegant interface that just works.
        </Text>
        <Text style={text}>
          Ready to see it in action? Just grab an OMF file from your 3D mining 
          software and you're moments away:
        </Text>
        <Section style={list}>
          <Text style={listItem}>
            <strong style={strong}>1. Upload Your Model:</strong> Drag and drop your OMF file
            at{' '}
            <Link href="https://app.underland.cloud" style={link}>
              Underland View
            </Link>
            .
          </Text>
          <Text style={listItem}>
            <strong style={strong}>2. Configure Layers and Launch:</strong> In settings, toggle which layers are
            visible to focus your narrative, then click launch!
          </Text>
          <Text style={listItem}>
            <strong style={strong}>3. Share Instantly:</strong> Copy the unique URL in the viewer and send it
            to your stakeholders. Visualisation is live 24/7 on a paid account.
          </Text>
        </Section>
        <Text style={text}>
          <strong>P.S.:</strong> Why did you sign up? What brought you here? Hit
          "Reply" and let me know.
        </Text>
        <Text style={signature}>
          Best,
          <br />
          Oliver
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          Yes, this is automated but{' '}
          <Link
            href="https://www.linkedin.com/in/oliver-mowbray/"
            style={link}
          >
            I'm a real person
          </Link>{' '}
          and I read all replies.
          <br />
          <Link href="https://underlandportal.com/manage-subscription" style={link}>
            1-click unsubscribe
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

// --- STYLES ---

const main = {
  backgroundColor: '#f6f9fc',
  // Set Helvetica as the base font for the entire email
  fontFamily:
    'Helvetica, "Helvetica Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '8px',
  maxWidth: '580px',
};

const greeting = {
  // This style now inherits its font from `main`.
  // We use a heavier weight to make it stand out as a headline.
  fontWeight: 600, // SemiBold
  fontSize: '24px',
  color: '#1a1a1a',
  lineHeight: '32px',
  margin: '0 0 24px 0',
};

const text = {
  color: '#333',
  fontSize: '16px',
  fontWeight: 400, // Regular
  lineHeight: '26px',
  margin: '0 0 20px 0',
};

const list = {
  margin: '20px 0',
};

const listItem = {
  ...text,
  margin: '12px 0',
};

const strong = {
  fontWeight: 700, // Bold
};

const link = {
  color: '#5469d4',
  textDecoration: 'underline',
};

const signature = {
  ...text,
  margin: '30px 0 0 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '24px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '18px',
  textAlign: 'center' as const,
};