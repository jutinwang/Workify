-- CreateTable
CREATE TABLE "EmployerSavedSearch" (
    "id" SERIAL NOT NULL,
    "employerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "filters" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployerSavedSearch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmployerSavedSearch_employerId_idx" ON "EmployerSavedSearch"("employerId");

-- AddForeignKey
ALTER TABLE "EmployerSavedSearch" ADD CONSTRAINT "EmployerSavedSearch_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "EmployerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
