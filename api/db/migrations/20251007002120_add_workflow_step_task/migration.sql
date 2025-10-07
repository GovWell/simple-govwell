-- CreateTable
CREATE TABLE "WorkflowStepTask" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "workflowStepId" INTEGER NOT NULL,
    CONSTRAINT "WorkflowStepTask_workflowStepId_fkey" FOREIGN KEY ("workflowStepId") REFERENCES "WorkflowStep" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "WorkflowStepTask_workflowStepId_idx" ON "WorkflowStepTask"("workflowStepId");
