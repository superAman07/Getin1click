/*
  Warnings:

  - You are about to drop the `_PurchasedLeads` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_PurchasedLeads" DROP CONSTRAINT "_PurchasedLeads_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_PurchasedLeads" DROP CONSTRAINT "_PurchasedLeads_B_fkey";

-- AlterTable
ALTER TABLE "public"."Lead" ADD COLUMN     "userId" TEXT;

-- DropTable
DROP TABLE "public"."_PurchasedLeads";

-- CreateTable
CREATE TABLE "public"."LeadAssignment" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeadAssignment_leadId_idx" ON "public"."LeadAssignment"("leadId");

-- CreateIndex
CREATE INDEX "LeadAssignment_professionalId_idx" ON "public"."LeadAssignment"("professionalId");

-- CreateIndex
CREATE UNIQUE INDEX "LeadAssignment_leadId_professionalId_key" ON "public"."LeadAssignment"("leadId", "professionalId");

-- CreateIndex
CREATE INDEX "Lead_customerId_idx" ON "public"."Lead"("customerId");

-- CreateIndex
CREATE INDEX "Lead_serviceId_idx" ON "public"."Lead"("serviceId");

-- AddForeignKey
ALTER TABLE "public"."Lead" ADD CONSTRAINT "Lead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeadAssignment" ADD CONSTRAINT "LeadAssignment_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeadAssignment" ADD CONSTRAINT "LeadAssignment_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
