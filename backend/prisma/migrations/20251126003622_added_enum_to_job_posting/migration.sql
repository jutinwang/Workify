-- CreateEnum
CREATE TYPE "CoopPostingStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'DELETED');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "postingStatus" "CoopPostingStatus" NOT NULL DEFAULT 'ACTIVE';
