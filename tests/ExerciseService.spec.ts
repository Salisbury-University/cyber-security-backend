import { test } from "@japa/runner";
import { ExerciseService } from "../app/services/ExerciseService";
import NotFoundException from "../app/exceptions/NotFoundException";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//deletes info from database
const deleteExercise = async (userID: string, exerciseID: string) => {
  await prisma.exercise.delete({
    where: {
      exerciseID_user: {
        exerciseID: exerciseID,
        user: userID,
      },
    },
  });
};

//gets metadata then displays it
test.group("ExerciseService", () => {
  test("/getMetaData", async ({ expect }, done: Function) => {
    var metaData = ExerciseService.getMetaData("how-to-parse-markdown");

    var json = JSON.parse(JSON.stringify(metaData));
    expect(json.title).toMatch("How to parse markdown");
    done();
  }).waitForDone();

  //fails in getting the metadata
  test("/getMetaData/Failed", async ({ expect }, done: Function) => {
    try {
      ExerciseService.getMetaData("Failed");
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      done();
    }
  }).waitForDone();

  //gets content then displays it
  test("/getContent", async ({ expect }, done: Function) => {
    var content = ExerciseService.getContent("how-to-parse-markdown");

    var json = JSON.parse(JSON.stringify(content));
    expect(json).not.toBeNull();

    done();
  }).waitForDone();

  //fails getting content
  test("/getContent/Failed", async ({ expect }, done: Function) => {
    try {
      ExerciseService.getContent("Failed");
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      done();
    }
  }).waitForDone();

  //fetches data and displays it
  test("/fetchData", async ({ expect }, done: Function) => {
    var display = ExerciseService.fetchData("2333", "how-to-parse-markdown");

    var json = JSON.parse(JSON.stringify(display));

    expect(json.metadata.title).toMatch("How to parse markdown");
    done();
  }).waitForDone();

  //fails fetching data
  test("/fetchData/Failed", async ({ expect }, done: Function) => {
    try {
      ExerciseService.fetchData("2333", "Failed");
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      done();
    }
    done();
  }).waitForDone();
});

// will create database with info and check status
test("/getStatus/", async ({ expect }, done: Function) => {
  const exerciseID: string = "1111";
  const userID: string = "4567";
  const status: string = "complete";

  // Create database for the exercise
  const content = await ExerciseService.createDB(userID, exerciseID, status);

  // Get the status
  const stat = await ExerciseService.getStatus(userID, exerciseID);

  // Delete the database
  await deleteExercise(userID, exerciseID);

  expect(stat).toBe("complete");

  done();
}).waitForDone();

// Get status with no user
test("/getStatus/NoUser", async ({ expect }, done: Function) => {
  const exerciseID: string = "1111";
  const userID: string = "4567";

  const display = await ExerciseService.getStatus(userID, exerciseID);
  expect(display).toBe(false);
  done();
}).waitForDone();
