-- Drop existing tables if they exist
DROP TABLE IF EXISTS "Mailing" CASCADE;
DROP TABLE IF EXISTS "List" CASCADE;
DROP TABLE IF EXISTS "EmailTemplate" CASCADE;
DROP TABLE IF EXISTS "RecipientGroup" CASCADE;

-- Create EmailTemplate table
CREATE TABLE "EmailTemplate" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL
);

-- Create List table
CREATE TABLE "List" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "emails" JSONB[] NOT NULL
);

-- Create Mailing table
CREATE TABLE "Mailing" (
    "id" SERIAL PRIMARY KEY,
    "mailerId" INTEGER NOT NULL,
    "listId" INTEGER NOT NULL REFERENCES "List"("id"),
    "templateId" INTEGER NOT NULL REFERENCES "EmailTemplate"("id"),
    "schedule" TIMESTAMP(3) NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "fk_list" FOREIGN KEY ("listId") REFERENCES "List"("id"),
    CONSTRAINT "fk_template" FOREIGN KEY ("templateId") REFERENCES "EmailTemplate"("id")
);

-- Create RecipientGroup table
CREATE TABLE "RecipientGroup" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL
); 