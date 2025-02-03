import { Worker, Job } from "bullmq";
import { redisClient } from "@/lib/redisClient";  // Use shared Redis connection
import { sendEmail } from "@/utils/sendEmail";  
import { prisma } from "@/lib/prisma";  

const emailWorker = new Worker(
  "mailQueue",
  async (job: Job) => {
    console.log("Processing job:", job.data);
    const { mailingId } = job.data;

    const mailing = await prisma.mailing.findUnique({ where: { id: mailingId } });
    if (!mailing) {
      throw new Error(`Mailing with ID ${mailingId} not found`);
    }

    await sendEmail(mailing.mailerId, mailing.listId);
    console.log(`✅ Email sent for mailing ID ${mailingId}`);
  },
  { connection: redisClient }  // ✅ Use shared Redis connection
);

emailWorker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed successfully.`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed: ${err.message}`);
});
