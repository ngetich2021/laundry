/*
  Warnings:

  - Added the required column `referrerName` to the `Referral` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referrerPhone` to the `Referral` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Referral" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "referrerClientId" TEXT,
    "referrerName" TEXT NOT NULL,
    "referrerPhone" TEXT NOT NULL,
    "referredName" TEXT NOT NULL,
    "referredPhone" TEXT NOT NULL,
    "referredClientId" TEXT,
    "rewardPercent" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "appliedToOrderRef" TEXT,
    "recordedById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "convertedAt" DATETIME,
    "rewardAppliedAt" DATETIME,
    CONSTRAINT "Referral_referrerClientId_fkey" FOREIGN KEY ("referrerClientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Referral_referredClientId_fkey" FOREIGN KEY ("referredClientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Referral_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Referral" ("appliedToOrderRef", "convertedAt", "createdAt", "id", "recordedById", "referredClientId", "referredName", "referredPhone", "referrerClientId", "rewardAppliedAt", "rewardPercent", "status") SELECT "appliedToOrderRef", "convertedAt", "createdAt", "id", "recordedById", "referredClientId", "referredName", "referredPhone", "referrerClientId", "rewardAppliedAt", "rewardPercent", "status" FROM "Referral";
DROP TABLE "Referral";
ALTER TABLE "new_Referral" RENAME TO "Referral";
CREATE INDEX "Referral_referrerPhone_idx" ON "Referral"("referrerPhone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
