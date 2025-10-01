/*
  Warnings:

  - You are about to drop the column `credits` on the `ProfessionalProfile` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `ProfessionalProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ProfessionalProfile" DROP COLUMN "credits",
DROP COLUMN "fullName",
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ALTER COLUMN "postcode" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."ProfessionalAnswer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answerText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessionalAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalAnswer_userId_questionId_key" ON "public"."ProfessionalAnswer"("userId", "questionId");

-- AddForeignKey
ALTER TABLE "public"."ProfessionalAnswer" ADD CONSTRAINT "ProfessionalAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProfessionalAnswer" ADD CONSTRAINT "ProfessionalAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
