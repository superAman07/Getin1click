/*
  Warnings:

  - You are about to drop the column `amountCredits` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `amountCurrency` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `professionalId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Transaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[merchantTransactionId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credits` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `merchantTransactionId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."PaymentProvider" AS ENUM ('PHONEPE', 'STRIPE', 'RAZORPAY');

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_professionalId_fkey";

-- AlterTable
ALTER TABLE "public"."Transaction" DROP COLUMN "amountCredits",
DROP COLUMN "amountCurrency",
DROP COLUMN "description",
DROP COLUMN "professionalId",
DROP COLUMN "type",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "bundleId" TEXT,
ADD COLUMN     "credits" INTEGER NOT NULL,
ADD COLUMN     "merchantTransactionId" TEXT NOT NULL,
ADD COLUMN     "provider" "public"."PaymentProvider" NOT NULL,
ADD COLUMN     "status" "public"."TransactionStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."TransactionType";

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_merchantTransactionId_key" ON "public"."Transaction"("merchantTransactionId");

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "public"."CreditBundle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
