-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cart" JSONB NOT NULL DEFAULT '[]';
