-- AlterTable
ALTER TABLE "tblSharpeners" ADD COLUMN     "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyOneDayBefore" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyTwoHoursBefore" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "tblUsers" ADD COLUMN     "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyOneDayBefore" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyTwoHoursBefore" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "tblPushSubscriptions" (
    "subscriptionId" SERIAL NOT NULL,
    "userId" INTEGER,
    "sharpenerId" INTEGER,
    "endpoint" TEXT NOT NULL,
    "p256dhKey" TEXT NOT NULL,
    "authKey" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tblPushSubscriptions_pkey" PRIMARY KEY ("subscriptionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "tblPushSubscriptions_endpoint_key" ON "tblPushSubscriptions"("endpoint");

-- AddForeignKey
ALTER TABLE "tblPushSubscriptions" ADD CONSTRAINT "tblPushSubscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tblUsers"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblPushSubscriptions" ADD CONSTRAINT "tblPushSubscriptions_sharpenerId_fkey" FOREIGN KEY ("sharpenerId") REFERENCES "tblSharpeners"("sharpenerId") ON DELETE CASCADE ON UPDATE CASCADE;
