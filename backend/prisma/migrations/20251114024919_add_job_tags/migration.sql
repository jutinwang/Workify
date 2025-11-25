/*
  Warnings:

  - You are about to drop the column `company` on the `EmployerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `EmployerProfile` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'INTERVIEW', 'OFFER', 'ACCEPTED');

-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "EmployerProfile" DROP COLUMN "company",
DROP COLUMN "role",
ADD COLUMN     "availability" TEXT,
ADD COLUMN     "companyId" INTEGER,
ADD COLUMN     "notificationMethod" TEXT,
ADD COLUMN     "profilePhotoUrl" TEXT,
ADD COLUMN     "workEmail" TEXT,
ADD COLUMN     "workPhone" TEXT;

-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "aboutMe" TEXT,
ADD COLUMN     "bookmarks" INTEGER[],
ADD COLUMN     "coverLetter" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "portfolio" TEXT,
ADD COLUMN     "transcript" TEXT,
ALTER COLUMN "gender" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Education" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "program" TEXT NOT NULL,
    "yearOfStudy" INTEGER,
    "gradDate" TIMESTAMP(3),
    "schoolName" TEXT NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT,
    "url" TEXT,
    "size" TEXT,
    "about" TEXT,
    "careersPage" TEXT,
    "linkedInUrl" TEXT,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "employerId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT,
    "type" TEXT,
    "salary" TEXT,
    "requirements" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "shortlisted" BOOLEAN NOT NULL DEFAULT false,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coverLetter" TEXT,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewRequest" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "employerId" INTEGER NOT NULL,
    "jobId" INTEGER,
    "status" "InterviewStatus" NOT NULL DEFAULT 'PENDING',
    "inviteList" JSONB,
    "calendarData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_JobTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_JobTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Education_studentId_idx" ON "Education"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_companyId_key" ON "Company"("companyId");

-- CreateIndex
CREATE INDEX "Job_companyId_idx" ON "Job"("companyId");

-- CreateIndex
CREATE INDEX "Job_employerId_idx" ON "Job"("employerId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "Application_studentId_idx" ON "Application"("studentId");

-- CreateIndex
CREATE INDEX "Application_jobId_idx" ON "Application"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_jobId_studentId_key" ON "Application"("jobId", "studentId");

-- CreateIndex
CREATE INDEX "InterviewRequest_studentId_idx" ON "InterviewRequest"("studentId");

-- CreateIndex
CREATE INDEX "InterviewRequest_employerId_idx" ON "InterviewRequest"("employerId");

-- CreateIndex
CREATE INDEX "_JobTags_B_index" ON "_JobTags"("B");

-- CreateIndex
CREATE INDEX "EmployerProfile_companyId_idx" ON "EmployerProfile"("companyId");

-- AddForeignKey
ALTER TABLE "EmployerProfile" ADD CONSTRAINT "EmployerProfile_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "EmployerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewRequest" ADD CONSTRAINT "InterviewRequest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewRequest" ADD CONSTRAINT "InterviewRequest_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "EmployerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobTags" ADD CONSTRAINT "_JobTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobTags" ADD CONSTRAINT "_JobTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
