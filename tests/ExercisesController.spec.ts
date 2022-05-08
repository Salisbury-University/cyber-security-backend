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

  test("fetchList: pass", async ({ expect }, done: Function) => {
    request(app)
      .get("/api/v1/exercises")
      .set(auth)
      .expect(200)
      .then((res) => {});
  });
});
