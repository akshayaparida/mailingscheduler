/*
  Warnings:

  - You are about to drop the column `createdAt` on the `List` table. All the data in the column will be lost.
  - You are about to drop the column `emails` on the `List` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `List` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `List` table. All the data in the column will be lost.
  - You are about to drop the `Mailer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Mailing" DROP CONSTRAINT "Mailing_listId_fkey";

-- DropForeignKey
ALTER TABLE "Mailing" DROP CONSTRAINT "Mailing_mailerId_fkey";

-- AlterTable
ALTER TABLE "List" DROP COLUMN "createdAt",
DROP COLUMN "emails",
DROP COLUMN "name",
DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "Mailer";

-- CreateTable
CREATE TABLE "Email" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "listId" INTEGER NOT NULL,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
