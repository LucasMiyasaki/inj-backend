/*
  Warnings:

  - You are about to drop the column `cancelRequestDate` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `cancelRequestReason` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "cancelRequestDate",
DROP COLUMN "cancelRequestReason";
