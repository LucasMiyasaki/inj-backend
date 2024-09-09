/*
  Warnings:

  - You are about to drop the column `subscriptionId` on the `Dependents` table. All the data in the column will be lost.
  - Added the required column `dependentsId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Dependents" DROP CONSTRAINT "Dependents_subscriptionId_fkey";

-- AlterTable
ALTER TABLE "Dependents" DROP COLUMN "subscriptionId";

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "dependentId" INTEGER,
ADD COLUMN     "dependentsId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_dependentsId_fkey" FOREIGN KEY ("dependentsId") REFERENCES "Dependents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
