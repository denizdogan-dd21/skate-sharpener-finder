/*
  Warnings:

  - You are about to drop the column `notificationsEnabled` on the `tblSharpeners` table. All the data in the column will be lost.
  - You are about to drop the column `notifyOneDayBefore` on the `tblSharpeners` table. All the data in the column will be lost.
  - You are about to drop the column `notifyTwoHoursBefore` on the `tblSharpeners` table. All the data in the column will be lost.
  - You are about to drop the column `notificationsEnabled` on the `tblUsers` table. All the data in the column will be lost.
  - You are about to drop the column `notifyOneDayBefore` on the `tblUsers` table. All the data in the column will be lost.
  - You are about to drop the column `notifyTwoHoursBefore` on the `tblUsers` table. All the data in the column will be lost.
  - You are about to drop the `tblPushSubscriptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "AppointmentStatus" ADD VALUE 'NO_SHOW';

-- DropForeignKey
ALTER TABLE "tblPushSubscriptions" DROP CONSTRAINT "tblPushSubscriptions_sharpenerId_fkey";

-- DropForeignKey
ALTER TABLE "tblPushSubscriptions" DROP CONSTRAINT "tblPushSubscriptions_userId_fkey";

-- AlterTable
ALTER TABLE "tblSharpeners" DROP COLUMN "notificationsEnabled",
DROP COLUMN "notifyOneDayBefore",
DROP COLUMN "notifyTwoHoursBefore";

-- AlterTable
ALTER TABLE "tblUsers" DROP COLUMN "notificationsEnabled",
DROP COLUMN "notifyOneDayBefore",
DROP COLUMN "notifyTwoHoursBefore";

-- DropTable
DROP TABLE "tblPushSubscriptions";
