-- CreateTable
CREATE TABLE "Exercise" (
    "exerciseID" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'incomplete',
    "user" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "preference" (
    "uid" TEXT NOT NULL,
    "darkmode" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_exerciseID_user_key" ON "Exercise"("exerciseID", "user");

-- CreateIndex
CREATE UNIQUE INDEX "preference_uid_key" ON "preference"("uid");
