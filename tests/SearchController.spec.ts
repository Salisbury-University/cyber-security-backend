import request from "supertest";
import { app } from "../app";
import { config } from "../app";
import { test } from "@japa/runner";
import jwt from "jsonwebtoken";

test.group("SearchController", () => {
  const uid = { uid: "test1234" };
  const token = jwt.sign(uid, config.app.secret);

  const auth = {
    Authorization: "Bearer ".concat(token),
    Accept: "application/json",
  };

  /**
   * Get request
   */
  test("GET", async ({ expect }, done: Function) => {
    request(app)
      .get("/api/v1/search/exercises?search=markdown")
      .set(auth)
      .expect(200)
      .then(async (res: any) => {
        const result = res.results;
        expect(result).not.toStrictEqual([]);
      });
    done();
  }).waitForDone();
});
