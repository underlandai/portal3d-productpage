import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface NewsletterConfirmationProps {
  userEmail?: string;
}

export const NewsletterConfirmation = ({
  userEmail = 'subscriber',
}: NewsletterConfirmationProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Underland View - 3D Mining Data Visualization</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={greeting}>Hey,</Text>
        <Text style={text}>
          My name is Oliver — I'm the founder and Managing Director of Underland Portal.
        </Text>
        <Text style={text}>
          We started Underland because we wanted a better format for communicating subsurface models value of the land beneath our feet.
        </Text>
        <Text style={text}>
          A simple, fast, and elegant interface that just works.
        </Text>
        <Text style={text}>
          <strong>Here are 3 tips to get started:</strong>
        </Text>
        <Section style={list}>
          <Text style={listItem}>1. Upload your OMF file at <a href="https://view.underlandportal.com" style={link}>view.underlandportal.com</a></Text>
          <Text style={listItem}>2. View your model and configure visible layers</Text>
          <Text style={listItem}>3. Copy your URL in the address bar and share it with your stakeholders</Text>
        </Section>
        <Text style={text}>
          <strong>P.S.:</strong> Why did you sign up? What brought you here?<br />
          Hit "Reply" and let me know. I read and reply to every email.
        </Text>
        <Text style={signature}>
          Cheers,<br />
          Oliver
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          Yes, this is automated but <a href="https://www.linkedin.com/in/oliver-mowbray/" style={link}>I'm a real person</a> and I read all replies<br />
          <a href="https://underlandportal.com/manage-subscription" style={link}>1-click unsubscribe</a>
        </Text>
      </Container>
    </Body>
  </Html>
);

export default NewsletterConfirmation;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
};

const greeting = {
  color: '#333',
  fontSize: '18px',
  lineHeight: '28px',
  margin: '0 0 24px 0',
  fontWeight: '500',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 20px 0',
};

const list = {
  margin: '20px 0',
};

const listItem = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '12px 0',
};

const link = {
  color: '#5469d4',
  textDecoration: 'underline',
};

const signature = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '30px 0 0 0',
  fontWeight: '500',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '10px 0',
  textAlign: 'center' as const,
};