/*
  Warnings:

  - You are about to drop the column `availability` on the `InterviewRequest` table. All the data in the column will be lost.
  - You are about to drop the column `proposedSlots` on the `InterviewRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InterviewRequest" DROP COLUMN "availability",
DROP COLUMN "proposedSlots";
