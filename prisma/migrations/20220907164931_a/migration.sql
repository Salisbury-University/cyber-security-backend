-- CreateTable
CREATE TABLE "VM" (
    "user" TEXT NOT NULL,
    "node" TEXT NOT NULL,
    "vm" TEXT NOT NULL,
    "exercise" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "port" TEXT NOT NULL,
    "timeLimit" TEXT NOT NULL,
    "timeStart" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeEnd" DATETIME NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Exercise" (
    "exercise_ID" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'incomplete',
    "user" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "preference" (
    "uid" TEXT NOT NULL,
    "darkmode" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "VM_user_exercise_key" ON "VM"("user", "exercise");

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_exercise_ID_user_key" ON "Exercise"("exercise_ID", "user");

-- CreateIndex
CREATE UNIQUE INDEX "preference_uid_key" ON "preference"("uid");
