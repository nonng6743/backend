-- Change User.id from UUID (String) to auto-incrementing Int
-- This recreates the table and migrates existing rows without preserving old IDs

BEGIN;

-- Create new sequence and table
CREATE SEQUENCE "User_id_seq";

CREATE TABLE "User_new" (
  "id" integer NOT NULL DEFAULT nextval('"User_id_seq"'),
  "email" text NOT NULL,
  "password" text NOT NULL,
  "name" text,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
);

ALTER SEQUENCE "User_id_seq" OWNED BY "User_new"."id";

-- Copy data (new auto ids will be assigned)
INSERT INTO "User_new" ("email", "password", "name", "createdAt", "updatedAt")
SELECT "email", "password", "name", "createdAt", "updatedAt" FROM "User";

-- Replace old table
DROP TABLE "User";
ALTER TABLE "User_new" RENAME TO "User";

-- Recreate constraints and indexes
ALTER TABLE "User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");

COMMIT;


