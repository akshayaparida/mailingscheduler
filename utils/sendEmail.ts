import axios from 'axios';
import { prisma } from '@/lib/prisma';

const apiKey = process.env.BREVO_API_KEY; // Brevo API key

export async function sendEmail(mailerId: number, listId: number) {
  try {
    const mailing = await prisma.mailing.findUnique({
      where: { id: mailerId },
    });

    if (!mailing) {
      throw new Error(`Mailing with ID ${mailerId} not found.`);
    }

    const list = await prisma.list.findUnique({
      where: { id: listId },
      include: { emails: true },
    });

    if (!list) {
      throw new Error(`List with ID ${listId} not found.`);
    }

    const recipients = list.emails.map((email) => email.address);

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
          'api-key': apiKey, // Pass your Brevo API key here
        },
      }
    );

    console.log('Email sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending email:', (error as Error).message);
    throw new Error('Failed to send email.');
  }
}
