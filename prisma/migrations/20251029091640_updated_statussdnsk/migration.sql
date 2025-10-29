/*
  Warnings:

  - The `status` column on the `LeadAssignment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."LeadAssignmentStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'MISSED');

-- AlterTable
ALTER TABLE "public"."LeadAssignment" DROP COLUMN "status",
ADD COLUMN     "status" "public"."LeadAssignmentStatus" NOT NULL DEFAULT 'PENDING';
