/*
  Warnings:

  - You are about to drop the column `location` on the `ProfessionalProfile` table. All the data in the column will be lost.
  - You are about to drop the column `postcode` on the `ProfessionalProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ProfessionalProfile" DROP COLUMN "location",
DROP COLUMN "postcode";

-- CreateTable
CREATE TABLE "public"."ProfessionalLocation" (
    "id" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "locationName" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "ProfessionalLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalLocation_profileId_postcode_key" ON "public"."ProfessionalLocation"("profileId", "postcode");

-- AddForeignKey
ALTER TABLE "public"."ProfessionalLocation" ADD CONSTRAINT "ProfessionalLocation_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."ProfessionalProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
