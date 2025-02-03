import axios from 'axios';
import { prisma } from '@/lib/prisma';

const apiKey = process.env.BREVO_API_KEY;

export async function sendEmail(mailerId: number, listId: number) {
  try {
    const mailing = await prisma.mailing.findUnique({
      where: { id: mailerId },
    });

    if (!mailing) {
      throw new Error(`Mailing with ID ${mailerId} not found.`);
    }

    // Correct: Use 'select' instead of 'include' for JSON fields
    const list = await prisma.list.findUnique({
      where: { id: listId },
      select: {
        emails: true, // Now correctly selecting the JSON field
      },
    });

    if (!list) {
      throw new Error(`List with ID ${listId} not found.`);
    }

    // Safely cast the JSON array to the expected Email type
    const emails = list.emails as Array<{ address: string }>;
    const recipients = emails.map((email) => email.address);

    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { email: 'akshayaparida2811@gmail.com' },
        to: recipients.map((email) => ({ email })),
        subject: mailing.subject,
        htmlContent: mailing.body,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
      }
    );

    console.log('Email sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending email:', (error as Error).message);
    throw new Error('Failed to send email.');
  }
}