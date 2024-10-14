/*
  Warnings:

  - You are about to drop the column `aplliedAt` on the `Application` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[challengeId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,workId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Like_workId_key";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "aplliedAt",
ADD COLUMN     "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "Application_challengeId_key" ON "Application"("challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_workId_key" ON "Like"("userId", "workId");
