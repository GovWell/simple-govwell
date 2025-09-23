/*
  Warnings:

  - You are about to drop the column `status` on the `Record` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `WorkflowStep` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `WorkflowStep` table. All the data in the column will be lost.
  - Added the required column `statusStr` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusStr` to the `WorkflowStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeStr` to the `WorkflowStep` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Record" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "statusStr" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Record" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "Record";
DROP TABLE "Record";
ALTER TABLE "new_Record" RENAME TO "Record";
CREATE TABLE "new_WorkflowStep" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order" INTEGER NOT NULL,
    "statusStr" TEXT NOT NULL,
    "typeStr" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "recordId" INTEGER NOT NULL,
    CONSTRAINT "WorkflowStep_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WorkflowStep" ("createdAt", "id", "order", "recordId", "updatedAt") SELECT "createdAt", "id", "order", "recordId", "updatedAt" FROM "WorkflowStep";
DROP TABLE "WorkflowStep";
ALTER TABLE "new_WorkflowStep" RENAME TO "WorkflowStep";
CREATE INDEX "WorkflowStep_recordId_idx" ON "WorkflowStep"("recordId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
