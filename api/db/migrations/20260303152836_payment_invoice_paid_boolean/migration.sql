/*
  Warnings:

  - You are about to drop the column `paymentAmount` on the `Payment` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "invoiceAmount" REAL NOT NULL,
    "invoicePaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workflowStepId" INTEGER NOT NULL,
    CONSTRAINT "Payment_workflowStepId_fkey" FOREIGN KEY ("workflowStepId") REFERENCES "WorkflowStep" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("createdAt", "id", "invoiceAmount", "workflowStepId") SELECT "createdAt", "id", "invoiceAmount", "workflowStepId" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
CREATE INDEX "Payment_workflowStepId_idx" ON "Payment"("workflowStepId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
