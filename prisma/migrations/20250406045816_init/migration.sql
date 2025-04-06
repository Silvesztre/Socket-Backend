/*
  Warnings:

  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileUrl" VARCHAR(1024) NOT NULL DEFAULT '',
ADD COLUMN     "username" VARCHAR(72) NOT NULL;
