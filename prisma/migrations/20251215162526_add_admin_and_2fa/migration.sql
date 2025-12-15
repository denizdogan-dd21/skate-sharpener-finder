/*
  Warnings:

  - You are about to drop the column `accountType` on the `tblEmailVerificationTokens` table. All the data in the column will be lost.
  - You are about to drop the `tblSharpeners` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email,userType]` on the table `tblEmailVerificationTokens` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,userType]` on the table `tblUsers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userType` to the `tblEmailVerificationTokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userType` to the `tblUsers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('CUSTOMER', 'SHARPENER', 'ADMIN');

-- CreateEnum
CREATE TYPE "AdminActionType" AS ENUM ('SUSPEND', 'UNSUSPEND', 'DEACTIVATE', 'ACTIVATE');

-- Step 1: Drop old foreign key constraints first
-- DropForeignKey
ALTER TABLE "tblAppointments" DROP CONSTRAINT "tblAppointments_sharpenerId_fkey";
ALTER TABLE "tblRatings" DROP CONSTRAINT "tblRatings_sharpenerId_fkey";
ALTER TABLE "tblSharpenerLocations" DROP CONSTRAINT "tblSharpenerLocations_sharpenerId_fkey";

-- Step 2: Drop old indexes including the email unique constraint
-- DropIndex
DROP INDEX "tblEmailVerificationTokens_email_accountType_key";
DROP INDEX "tblUsers_email_key";

-- Step 3: Add new columns to tblUsers with defaults first
ALTER TABLE "tblUsers" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "tblUsers" ADD COLUMN     "averageRating" DOUBLE PRECISION;
ALTER TABLE "tblUsers" ADD COLUMN     "bio" TEXT;
ALTER TABLE "tblUsers" ADD COLUMN     "suspended" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "tblUsers" ADD COLUMN     "suspensionEndDate" TIMESTAMP(3);
ALTER TABLE "tblUsers" ADD COLUMN     "suspensionReason" TEXT;
ALTER TABLE "tblUsers" ADD COLUMN     "totalRatings" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "tblUsers" ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "tblUsers" ADD COLUMN     "twoFactorSecret" TEXT;
ALTER TABLE "tblUsers" ADD COLUMN     "userType" "UserType" NOT NULL DEFAULT 'CUSTOMER';

-- Step 4: Migrate Sharpeners data to tblUsers before dropping
-- Find the max userId to avoid conflicts
DO $$
DECLARE
    max_user_id INTEGER;
BEGIN
    SELECT COALESCE(MAX("userId"), 0) INTO max_user_id FROM "tblUsers";
    
    -- Insert sharpeners as new users with SHARPENER type
    INSERT INTO "tblUsers" (
        "userId", "email", "password", "userType", "firstName", "lastName", 
        "phone", "bio", "isEmailVerified", "averageRating", "totalRatings", 
        "active", "suspended", "twoFactorEnabled", "createdAt"
    )
    SELECT 
        "sharpenerId" + max_user_id,  -- Offset IDs to avoid conflicts
        "email", 
        "password", 
        'SHARPENER'::"UserType",
        "firstName", 
        "lastName", 
        "phone", 
        "bio", 
        "isEmailVerified", 
        "averageRating", 
        "totalRatings",
        true,
        false,
        true,
        "createdAt"
    FROM "tblSharpeners";
    
    -- Update SharpenerLocations to point to the new userId
    UPDATE "tblSharpenerLocations" sl
    SET "sharpenerId" = s."sharpenerId" + max_user_id
    FROM "tblSharpeners" s
    WHERE sl."sharpenerId" = s."sharpenerId";
    
    -- Update Appointments to point to the new sharpener userId
    UPDATE "tblAppointments" a
    SET "sharpenerId" = s."sharpenerId" + max_user_id
    FROM "tblSharpeners" s
    WHERE a."sharpenerId" = s."sharpenerId";
    
    -- Update Ratings to point to the new sharpener userId
    UPDATE "tblRatings" r
    SET "sharpenerId" = s."sharpenerId" + max_user_id
    FROM "tblSharpeners" s
    WHERE r."sharpenerId" = s."sharpenerId";
END $$;

-- Step 6: Add canceledBy column to appointments
-- AlterTable
ALTER TABLE "tblAppointments" ADD COLUMN "canceledBy" TEXT;

-- Step 7: Update EmailVerificationTokens
-- AlterTable
ALTER TABLE "tblEmailVerificationTokens" 
  ALTER COLUMN "accountType" TYPE TEXT,
  ALTER COLUMN "accountType" SET DATA TYPE "UserType" USING 
    CASE 
      WHEN "accountType" = 'user' THEN 'CUSTOMER'::"UserType"
      WHEN "accountType" = 'sharpener' THEN 'SHARPENER'::"UserType"
      ELSE 'CUSTOMER'::"UserType"
    END;

ALTER TABLE "tblEmailVerificationTokens" RENAME COLUMN "accountType" TO "userType";

-- Step 8: Now we can safely drop the Sharpeners table
-- DropTable
DROP TABLE "tblSharpeners";

-- CreateTable
CREATE TABLE "tblTwoFactorTokens" (
    "tokenId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userType" "UserType" NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tblTwoFactorTokens_pkey" PRIMARY KEY ("tokenId")
);

-- CreateTable
CREATE TABLE "tblAdminActions" (
    "actionId" TEXT NOT NULL,
    "adminId" INTEGER NOT NULL,
    "actionType" "AdminActionType" NOT NULL,
    "targetUserId" INTEGER NOT NULL,
    "targetUserEmail" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tblAdminActions_pkey" PRIMARY KEY ("actionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "tblTwoFactorTokens_email_userType_token_key" ON "tblTwoFactorTokens"("email", "userType", "token");

-- CreateIndex
CREATE UNIQUE INDEX "tblEmailVerificationTokens_email_userType_key" ON "tblEmailVerificationTokens"("email", "userType");

-- CreateIndex
CREATE UNIQUE INDEX "tblUsers_email_userType_key" ON "tblUsers"("email", "userType");

-- AddForeignKey
ALTER TABLE "tblSharpenerLocations" ADD CONSTRAINT "tblSharpenerLocations_sharpenerId_fkey" FOREIGN KEY ("sharpenerId") REFERENCES "tblUsers"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblAppointments" ADD CONSTRAINT "tblAppointments_sharpenerId_fkey" FOREIGN KEY ("sharpenerId") REFERENCES "tblUsers"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblRatings" ADD CONSTRAINT "tblRatings_sharpenerId_fkey" FOREIGN KEY ("sharpenerId") REFERENCES "tblUsers"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblAdminActions" ADD CONSTRAINT "tblAdminActions_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "tblUsers"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
