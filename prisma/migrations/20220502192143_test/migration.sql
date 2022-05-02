-- CreateTable
CREATE TABLE "Exercise" (
    "exercise_ID" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'incomplete',
    "user" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_exercise_ID_user_key" ON "Exercise"("exercise_ID", "user");
