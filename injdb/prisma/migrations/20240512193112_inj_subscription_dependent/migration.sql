/*
  Warnings:

  - You are about to drop the column `dependentsId` on the `Subscription` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_dependentsId_fkey";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "dependentsId";

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_dependentId_fkey" FOREIGN KEY ("dependentId") REFERENCES "Dependents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
