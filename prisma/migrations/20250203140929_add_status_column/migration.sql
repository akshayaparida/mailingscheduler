/*
  Warnings:

  - You are about to drop the `Email` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `List` table without a default value. This is not possible if the table is not empty.
  - Added the required column `templateId` to the `Mailing` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Email" DROP CONSTRAINT "Email_listId_fkey";

-- AlterTable
ALTER TABLE "List" ADD COLUMN     "emails" JSONB[],
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Mailing" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "templateId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Email";

-- AddForeignKey
ALTER TABLE "Mailing" ADD CONSTRAINT "Mailing_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "EmailTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
