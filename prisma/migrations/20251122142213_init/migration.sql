-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'DENIED', 'CANCELLED', 'COMPLETED', 'RATED', 'EXPIRED');

-- CreateTable
CREATE TABLE "tblUsers" (
    "userId" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tblUsers_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "tblSharpeners" (
    "sharpenerId" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "bio" TEXT,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "averageRating" DOUBLE PRECISION,
    "totalRatings" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tblSharpeners_pkey" PRIMARY KEY ("sharpenerId")
);

-- CreateTable
CREATE TABLE "tblSharpenerLocations" (
    "locationId" SERIAL NOT NULL,
    "sharpenerId" INTEGER NOT NULL,
    "locationName" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tblSharpenerLocations_pkey" PRIMARY KEY ("locationId")
);

-- CreateTable
CREATE TABLE "tblSharpeningMachines" (
    "machineId" SERIAL NOT NULL,
    "locationId" INTEGER NOT NULL,
    "machineType" TEXT NOT NULL,
    "radiusOptions" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tblSharpeningMachines_pkey" PRIMARY KEY ("machineId")
);

-- CreateTable
CREATE TABLE "tblAvailability" (
    "availabilityId" SERIAL NOT NULL,
    "locationId" INTEGER NOT NULL,
    "machineId" INTEGER NOT NULL,
    "availableDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tblAvailability_pkey" PRIMARY KEY ("availabilityId")
);

-- CreateTable
CREATE TABLE "tblAppointments" (
    "appointmentId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "sharpenerId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "machineId" INTEGER NOT NULL,
    "availabilityId" INTEGER NOT NULL,
    "requestedDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tblAppointments_pkey" PRIMARY KEY ("appointmentId")
);

-- CreateTable
CREATE TABLE "tblRatings" (
    "ratingId" SERIAL NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "sharpenerId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tblRatings_pkey" PRIMARY KEY ("ratingId")
);

-- CreateIndex
CREATE UNIQUE INDEX "tblUsers_email_key" ON "tblUsers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tblSharpeners_email_key" ON "tblSharpeners"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tblRatings_appointmentId_key" ON "tblRatings"("appointmentId");

-- AddForeignKey
ALTER TABLE "tblSharpenerLocations" ADD CONSTRAINT "tblSharpenerLocations_sharpenerId_fkey" FOREIGN KEY ("sharpenerId") REFERENCES "tblSharpeners"("sharpenerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblSharpeningMachines" ADD CONSTRAINT "tblSharpeningMachines_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "tblSharpenerLocations"("locationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblAvailability" ADD CONSTRAINT "tblAvailability_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "tblSharpenerLocations"("locationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblAvailability" ADD CONSTRAINT "tblAvailability_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "tblSharpeningMachines"("machineId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblAppointments" ADD CONSTRAINT "tblAppointments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tblUsers"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblAppointments" ADD CONSTRAINT "tblAppointments_sharpenerId_fkey" FOREIGN KEY ("sharpenerId") REFERENCES "tblSharpeners"("sharpenerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblAppointments" ADD CONSTRAINT "tblAppointments_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "tblSharpenerLocations"("locationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblAppointments" ADD CONSTRAINT "tblAppointments_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "tblSharpeningMachines"("machineId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblAppointments" ADD CONSTRAINT "tblAppointments_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "tblAvailability"("availabilityId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblRatings" ADD CONSTRAINT "tblRatings_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "tblAppointments"("appointmentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblRatings" ADD CONSTRAINT "tblRatings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tblUsers"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblRatings" ADD CONSTRAINT "tblRatings_sharpenerId_fkey" FOREIGN KEY ("sharpenerId") REFERENCES "tblSharpeners"("sharpenerId") ON DELETE CASCADE ON UPDATE CASCADE;
