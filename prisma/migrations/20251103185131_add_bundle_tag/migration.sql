-- CreateEnum
CREATE TYPE "public"."BundleTag" AS ENUM ('BASIC', 'STANDARD', 'PREMIUM', 'PLATINUM');

-- AlterTable
ALTER TABLE "public"."CreditBundle" ADD COLUMN     "tag" "public"."BundleTag";
