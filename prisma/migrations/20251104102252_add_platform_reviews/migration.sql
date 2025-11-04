-- CreateTable
CREATE TABLE "public"."PlatformReview" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PlatformReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlatformReview_isFeatured_idx" ON "public"."PlatformReview"("isFeatured");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformReview_userId_key" ON "public"."PlatformReview"("userId");

-- AddForeignKey
ALTER TABLE "public"."PlatformReview" ADD CONSTRAINT "PlatformReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
