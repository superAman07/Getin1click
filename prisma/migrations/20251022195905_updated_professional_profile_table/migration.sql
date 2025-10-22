-- AlterTable
ALTER TABLE "public"."ProfessionalProfile" ADD COLUMN     "notifyOnNewLead" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyOnNewMessage" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyOnPayment" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyWeeklySummary" BOOLEAN NOT NULL DEFAULT false;
