import { test } from "@japa/runner";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

test.group("ExerciseService", () => {
  const uid = { uid: "test1234" };
  const token = jwt.sign(uid, "asdf");

  const auth = {
    Authorization: "Bearer ".concat(token),
    Accept: "application/json",
  };

  /**
   * PASS:
   * Test for fetch all exercises route
   */
  test("GET /api/v1/exercises: PASS", async ({ expect }, done: Function) => {
    request(app)
      .get("/api/v1/exercises")
      .set(auth)
      .expect(200)
      .then((res) => {
        const json = JSON.parse(res.text);
        expect(typeof json.exercises).toBe("object");
        done();
      });
  }).waitForDone();

  /**
   * PASS:
   * Test for fetching page exercises route
   */
  test("GET /api/v1/exercises/:page: PASS", async ({
    expect,
  }, done: Function) => {
    request(app)
      .get("/api/v1/exercises/1")
      .set(auth)
      .expect(200)
      .then((res) => {
        const json = JSON.parse(res.text);
        expect(typeof json.exercises).toBe("object");
        done();
      });
  }).waitForDone();

  /**
   * FAIL: Validation fail
   * Test for fetching page exercises route
   */
  test("GET /api/v1/exercises/:page: FAIL", async ({
    expect,
  }, done: Function) => {
    request(app)
      .get("/api/v1/exercises/a")
      .set(auth)
      .expect(422)
      .then((res) => {
        expect(res.status).toEqual(422);
        done();
      });
  }).waitForDone();
});
