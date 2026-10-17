/*
  Warnings:

  - You are about to drop the column `walkInName` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `walkInPhone` on the `Sale` table. All the data in the column will be lost.
  - Made the column `clientId` on table `Sale` required. This step will fail if there are existing NULL values in that column.
  - Made the column `soldById` on table `Sale` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sale" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "subtotal" REAL NOT NULL,
    "discountPercent" REAL NOT NULL DEFAULT 0,
    "total" REAL NOT NULL,
    "amountPaid" REAL NOT NULL DEFAULT 0,
    "paymentMethod" TEXT NOT NULL DEFAULT 'CASH',
    "status" TEXT NOT NULL DEFAULT 'UNPAID',
    "notes" TEXT,
    "soldById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Sale_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Sale_soldById_fkey" FOREIGN KEY ("soldById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Sale" ("amountPaid", "clientId", "createdAt", "discountPercent", "id", "notes", "paymentMethod", "soldById", "status", "subtotal", "total") SELECT "amountPaid", "clientId", "createdAt", "discountPercent", "id", "notes", "paymentMethod", "soldById", "status", "subtotal", "total" FROM "Sale";
DROP TABLE "Sale";
ALTER TABLE "new_Sale" RENAME TO "Sale";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
