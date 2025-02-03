import { Worker } from 'bullmq';
import { prisma } from './prisma';
import { sendEmail } from './email';
import { Redis } from 'ioredis';

const connection = new Redis({
  host: process.env.REDIS_HOST ?? 'localhost',  // Use nullish coalescing
  port: Number(process.env.REDIS_PORT) ?? 6379,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

interface Email {
  address: string;
}

const worker = new Worker(
  'mailQueue',
  async (job) => {
    console.log('Starting to process job:', job.id);
    console.log('Job data:', job.data);

    try {
      const { mailingId } = job.data;
      console.log('Looking for mailing with ID:', mailingId);

      // Fetch mailing data with types correctly applied
      const mailing = await prisma.mailing.findUnique({
        where: { 
          id: Number(mailingId),
        },
        include: {
          list: {
            select: {
              id: true,
              name: true,
              emails: true, // Type here is crucial
            },
          },
          template: {
            select: {
              id: true,
              name: true,
              subject: true,
              body: true,
            },
          },
        },
      });

      if (!mailing || !mailing.list || !mailing.list.emails) {
        console.error(`No mailing found with ID ${mailingId}`);
        throw new Error(`Mailing ${mailingId} not found`);
      }

      console.log(`Processing mailing ${mailingId} to ${mailing.list.emails.length} recipients`);

      // Ensuring the emails are of the correct type
      const emailPromises = (mailing.list.emails as unknown as Email[])
  .filter((emailObj): emailObj is Email => emailObj && typeof emailObj === 'object' && 'address' in emailObj)
  .map(async (emailObj: Email) => {
          try {
            console.log(`Attempting to send email to ${emailObj.address}`);
            await sendEmail({
              to: emailObj.address,
              subject: mailing.template.subject,
              html: mailing.template.body,
            });
            console.log(`Successfully sent email to ${emailObj.address}`);
          } catch (error) {
            console.error(`Failed to send email to ${emailObj.address}:`, error);
            throw error;
          }
        });

      await Promise.all(emailPromises);
      console.log(`Successfully completed sending all emails for mailing ${mailingId}`);

      // Update mailing status if needed
      await prisma.mailing.update({
        where: { id: Number(mailingId) },
        data: { updatedAt: new Date() },
      });

    } catch (error) {
      console.error('Error processing mailing:', error);
      throw error;
    }
  },
  { 
    connection,
    concurrency: 1,
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 100 }
  }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on('failed', (job, error) => {
  console.error(`Job ${job?.id} failed:`, error);
});

export { worker };
