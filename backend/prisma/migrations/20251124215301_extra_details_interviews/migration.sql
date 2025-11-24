/*
  Warnings:

  - You are about to drop the column `calendarData` on the `InterviewRequest` table. All the data in the column will be lost.
  - Added the required column `durationMinutes` to the `InterviewRequest` table without a default value. This is not possible if the table is not empty.
  - Made the column `jobId` on table `InterviewRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "InterviewRequest" DROP COLUMN "calendarData",
ADD COLUMN     "applicationId" INTEGER,
ADD COLUMN     "availability" JSONB,
ADD COLUMN     "chosenEnd" TIMESTAMP(3),
ADD COLUMN     "chosenStart" TIMESTAMP(3),
ADD COLUMN     "durationMinutes" INTEGER NOT NULL,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "proposedSlots" JSONB,
ALTER COLUMN "jobId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "InterviewRequest_jobId_idx" ON "InterviewRequest"("jobId");

-- AddForeignKey
ALTER TABLE "InterviewRequest" ADD CONSTRAINT "InterviewRequest_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewRequest" ADD CONSTRAINT "InterviewRequest_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
