/*
  Warnings:

  - You are about to drop the `UserBook` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `url` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BookType" ADD VALUE 'DEVOTIONAL';
ALTER TYPE "BookType" ADD VALUE 'THEOLOGY';
ALTER TYPE "BookType" ADD VALUE 'BIBLE_STUDY';
ALTER TYPE "BookType" ADD VALUE 'CHRISTIAN_FICTION';
ALTER TYPE "BookType" ADD VALUE 'SPIRITUAL_SELF_HELP';
ALTER TYPE "BookType" ADD VALUE 'BIOGRAPHY';
ALTER TYPE "BookType" ADD VALUE 'MISSIONS';
ALTER TYPE "BookType" ADD VALUE 'CHRISTIAN_EDUCATION';
ALTER TYPE "BookType" ADD VALUE 'FAMILY';
ALTER TYPE "BookType" ADD VALUE 'CHRISTIAN_LEADERSHIP';

-- DropForeignKey
ALTER TABLE "UserBook" DROP CONSTRAINT "UserBook_bookId_fkey";

-- DropForeignKey
ALTER TABLE "UserBook" DROP CONSTRAINT "UserBook_userId_fkey";

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "url" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserBook";
