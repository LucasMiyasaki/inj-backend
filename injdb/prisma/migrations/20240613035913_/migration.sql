/*
  Warnings:

  - You are about to alter the column `value` on the `Expenditure` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `fee` on the `Expenditure` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "Expenditure" ALTER COLUMN "value" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "fee" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Income" RENAME CONSTRAINT "CashHandling_pkey" TO "Income_pkey";
