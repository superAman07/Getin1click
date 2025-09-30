-- CreateEnum
CREATE TYPE "public"."QuestionInputType" AS ENUM ('TEXT', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE');

-- AlterTable
ALTER TABLE "public"."Question" ADD COLUMN     "inputType" "public"."QuestionInputType" NOT NULL DEFAULT 'SINGLE_CHOICE';
