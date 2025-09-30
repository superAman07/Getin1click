-- CreateEnum
CREATE TYPE "public"."QuestionType" AS ENUM ('CUSTOMER', 'PROFESSIONAL');

-- AlterTable
ALTER TABLE "public"."Question" ADD COLUMN     "type" "public"."QuestionType" NOT NULL DEFAULT 'CUSTOMER';
