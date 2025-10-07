/*
  Warnings:

  - Added the required column `order` to the `WorkflowStepTask` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WorkflowStepTask" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "workflowStepId" INTEGER NOT NULL,
    CONSTRAINT "WorkflowStepTask_workflowStepId_fkey" FOREIGN KEY ("workflowStepId") REFERENCES "WorkflowStep" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WorkflowStepTask" ("createdAt", "id", "status", "type", "updatedAt", "workflowStepId") SELECT "createdAt", "id", "status", "type", "updatedAt", "workflowStepId" FROM "WorkflowStepTask";
DROP TABLE "WorkflowStepTask";
ALTER TABLE "new_WorkflowStepTask" RENAME TO "WorkflowStepTask";
CREATE INDEX "WorkflowStepTask_workflowStepId_idx" ON "WorkflowStepTask"("workflowStepId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
