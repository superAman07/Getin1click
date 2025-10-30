/*
  Warnings:

  - Changed the type of `type` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('LEAD_ASSIGNED', 'LEAD_ACCEPTED_BY_OTHER', 'WALLET_TOPUP', 'WELCOME_PRO', 'NEW_LEAD_FOR_ASSIGNMENT', 'LEAD_REJECTED_BY_PRO', 'ISSUE_REPORTED_BY_CUSTOMER', 'NEW_PROFESSIONAL_SIGNUP');

-- AlterTable
ALTER TABLE "public"."Notification" DROP COLUMN "type",
ADD COLUMN     "type" "public"."NotificationType" NOT NULL;
