-- CreateTable
CREATE TABLE "Mailing" (
    "id" SERIAL NOT NULL,
    "mailerId" INTEGER NOT NULL,
    "listId" INTEGER NOT NULL,
    "schedule" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mailing_pkey" PRIMARY KEY ("id")
);
