/*
  Warnings:

  - You are about to drop the column `requirements` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "requirements",
ADD COLUMN     "benefits" TEXT,
ADD COLUMN     "length" TEXT,
ADD COLUMN     "qualification" TEXT;
