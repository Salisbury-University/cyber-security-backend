import { test } from "@japa/runner";

import { ExerciseService } from "../app/services/ExerciseService";
import NotFoundException from "../app/exceptions/NotFoundException";
import { json } from "stream/consumers";

test.group("ExerciseService", () => {
  test("/getMetaData", async ({ expect }, done: Function) => {
    var metaData = ExerciseService.getMetaData("how-to-parse-markdown");

    var json = JSON.parse(JSON.stringify(metaData));
    expect(json.title).toMatch("How to parse markdown");
    done();
  }).waitForDone();

  test("/getMetaData/Failed", async ({ expect }, done: Function) => {
    try {
      ExerciseService.getMetaData("Failed");
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      done();
    }
  }).waitForDone();

  test("/getContent", async ({ expect }, done: Function) => {
    var content = ExerciseService.getContent("how-to-parse-markdown");

    var json = JSON.parse(JSON.stringify(content));
    expect(json).not.toBeNull();

    done();
  }).waitForDone();

  test("/getContent/Failed", async ({ expect }, done: Function) => {
    try {
      ExerciseService.getContent("Failed");
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      done();
    }
  }).waitForDone();

  test("/fetchData", async ({ expect }, done: Function) => {
    var display = ExerciseService.fetchData("2333", "how-to-parse-markdown");

    var json = JSON.parse(JSON.stringify(display));

    expect(json.metadata.title).toMatch("How to parse markdown");
    done();
  }).waitForDone();

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

test("/getStatus/", async ({ expect }, done: Function) => {
  const content = ExerciseService.createDB("1111", "4567", "complete");

  var json = JSON.parse(JSON.stringify(content));

  expect(json).toBeNull();

  done();
}).waitForDone();

test("/getStatus/NoUser", async ({ expect }, done: Function) => {
  const display = ExerciseService.getStatus("101", "233");

  expect(display).toEqual(false);
  done();
}).waitForDone();
