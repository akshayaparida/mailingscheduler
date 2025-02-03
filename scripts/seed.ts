const { PrismaClient } = require('@prisma/client');
const { mailQueue } = require('../lib/queue');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting to seed database...');

    // Create a template
    const template = await prisma.emailTemplate.create({
      data: {
        name: "Test Brevo Email",
        subject: "Test Scheduled Email via Brevo",
        body: `
          <h1>Test Email from Mailing Scheduler</h1>
          <p>Hello,</p>
          <p>This is a test email sent via Brevo SMTP from our mailing scheduler system.</p>
          <p>If you're receiving this, the scheduling and email delivery system is working correctly!</p>
          <br>
          <p>Best regards,</p>
          <p>Mailing Scheduler System</p>
        `
      },
    });
    console.log('Created template:', template);

    // Create a list with your test email
    const list = await prisma.list.create({
      data: {
        name: "Test Email List",
        emails: [
          { address: "akparida28@gmail.com" }
        ],
      },
    });
    console.log('Created list:', list);

    const scheduleTime = new Date(Date.now() + 30 * 1000); // 30 seconds from now

    // Create a test mailing
    const mailing = await prisma.mailing.create({
      data: {
        mailerId: 1,
        listId: list.id,
        templateId: template.id,
        schedule: scheduleTime,
        subject: template.subject,
        body: template.body,
        updatedAt: new Date()
      },
    });
    console.log('Created mailing:', mailing);

    // Add to queue
    const delay = scheduleTime.getTime() - Date.now();
    await mailQueue.add(
      'sendEmail',
      {
        mailingId: mailing.id,
        mailerId: mailing.mailerId,
        listId: mailing.listId,
        schedule: scheduleTime.toISOString(),
      },
      { 
        delay: Math.max(0, delay),
        removeOnComplete: true,
        removeOnFail: true,
      }
    );
    console.log('Added mailing to queue with delay:', delay, 'ms');

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('Unhandled error:', e);
    process.exit(1);
  });