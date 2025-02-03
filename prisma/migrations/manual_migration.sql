-- Drop existing tables if they exist
DROP TABLE IF EXISTS "Email" CASCADE;
DROP TABLE IF EXISTS "Mailing" CASCADE;
DROP TABLE IF EXISTS "List" CASCADE;
DROP TABLE IF EXISTS "EmailTemplate" CASCADE;
DROP TABLE IF EXISTS "RecipientGroup" CASCADE;

-- Create tables
CREATE TABLE "List" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "emails" JSONB[] NOT NULL
);

CREATE TABLE "EmailTemplate" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL
);

CREATE TABLE "Mailing" (
    "id" SERIAL PRIMARY KEY,
    "mailerId" INTEGER NOT NULL,
    "listId" INTEGER NOT NULL,
    "templateId" INTEGER NOT NULL,
    "schedule" TIMESTAMP(3) NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("listId") REFERENCES "List"("id"),
    FOREIGN KEY ("templateId") REFERENCES "EmailTemplate"("id")
);

CREATE TABLE "RecipientGroup" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL
); 