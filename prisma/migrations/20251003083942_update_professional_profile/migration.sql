-- CreateEnum
CREATE TYPE "public"."CompanySize" AS ENUM ('SOLO', 'SMALL_TEAM', 'MEDIUM_TEAM', 'LARGE_TEAM');

-- AlterTable
ALTER TABLE "public"."ProfessionalProfile" ADD COLUMN     "companyEmail" TEXT,
ADD COLUMN     "companyLogoUrl" TEXT,
ADD COLUMN     "companyPhoneNumber" TEXT,
ADD COLUMN     "companySize" "public"."CompanySize" DEFAULT 'SOLO',
ADD COLUMN     "profilePictureUrl" TEXT,
ADD COLUMN     "socialMedia" JSONB,
ADD COLUMN     "websiteUrl" TEXT,
ADD COLUMN     "yearFounded" INTEGER;

-- CreateTable
CREATE TABLE "public"."ProfilePhoto" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfilePhoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ProfilePhoto" ADD CONSTRAINT "ProfilePhoto_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."ProfessionalProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
