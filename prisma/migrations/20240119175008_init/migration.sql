/*
  Warnings:

  - You are about to drop the `muxdata` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,courseId]` on the table `Purchase` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `size` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `muxdata` DROP FOREIGN KEY `MuxData_chapterId_fkey`;

-- AlterTable
ALTER TABLE `attachment` ADD COLUMN `size` INTEGER NOT NULL;

-- DropTable
DROP TABLE `muxdata`;

-- CreateIndex
CREATE UNIQUE INDEX `Purchase_userId_courseId_key` ON `Purchase`(`userId`, `courseId`);
