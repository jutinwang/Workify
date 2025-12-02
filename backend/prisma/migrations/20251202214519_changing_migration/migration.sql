/*
  Warnings:

  - You are about to drop the column `accountStatus` on the `EmployerProfile` table. All the data in the column will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "EmployerProfile" DROP COLUMN "accountStatus",
ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "suspended" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "public"."AuditLog";

-- DropEnum
DROP TYPE "public"."EmployerAccountStatus";
