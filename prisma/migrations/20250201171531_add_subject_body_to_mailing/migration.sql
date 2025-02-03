/*
  Warnings:

  - Added the required column `body` to the `Mailing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `Mailing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mailing" ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "subject" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Mailer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mailer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "List" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "emails" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Mailing" ADD CONSTRAINT "Mailing_mailerId_fkey" FOREIGN KEY ("mailerId") REFERENCES "Mailer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mailing" ADD CONSTRAINT "Mailing_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
