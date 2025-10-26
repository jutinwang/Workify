/*
  Warnings:

  - Added the required column `gender` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('WOMAN', 'MAN', 'NON_BINARY', 'TWO_SPIRIT', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "Ethnicity" AS ENUM ('BLACK', 'EAST_ASIAN', 'SOUTH_ASIAN', 'SOUTHEAST_ASIAN', 'MENA', 'LATINX', 'WHITE', 'MIXED', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "IdentityFlag" AS ENUM ('INDIGENOUS', 'DISABILITY', 'VETERAN');

-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "ethnicity" "Ethnicity"[],
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "linkedInUrl" TEXT,
ADD COLUMN     "optional" "IdentityFlag"[];

-- CreateTable
CREATE TABLE "Experience" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "description" TEXT,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Experience_userId_idx" ON "Experience"("userId");

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
