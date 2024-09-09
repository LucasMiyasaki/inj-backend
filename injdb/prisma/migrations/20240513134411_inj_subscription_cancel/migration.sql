/*
  Warnings:

  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserNotification` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CancelRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "UserNotification" DROP CONSTRAINT "UserNotification_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "UserNotification" DROP CONSTRAINT "UserNotification_userId_fkey";

-- AlterTable
ALTER TABLE "Dependents" ADD COLUMN     "observation" TEXT;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "cancelRequest" BOOLEAN DEFAULT false,
ADD COLUMN     "cancelRequestApprovalDate" TIMESTAMP(3),
ADD COLUMN     "cancelRequestApprovedBy" INTEGER,
ADD COLUMN     "cancelRequestDate" TIMESTAMP(3),
ADD COLUMN     "cancelRequestReason" TEXT,
ADD COLUMN     "cancelRequestStatus" "CancelRequestStatus";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "UserNotification";
