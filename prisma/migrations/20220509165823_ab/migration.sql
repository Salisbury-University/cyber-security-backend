-- CreateTable
CREATE TABLE "preference" (
    "uid" TEXT NOT NULL,
    "darkmode" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "preference_uid_key" ON "preference"("uid");
