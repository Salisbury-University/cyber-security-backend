import request from "supertest";
import { app } from "../app";
import { test } from "@japa/runner";
import jwt from "jsonwebtoken";

test.group("PreferenceController", () => {
  const uid = { uid: "test1234" };
  const token = jwt.sign(uid, "asdf");

  const auth = {
    Authorization: "Bearer ".concat(token),
    Accept: "application/json",
  };

  /**
   * Get request
   */
  test("GET", async ({ expect }, done: Function) => {
    request(app)
      .get("/api/v1/preference")
      .set(auth)
      .expect(200)
      .then(async (res) => {
        const json = JSON.parse(res.text);
        expect(json.preference.uid).toEqual(uid.uid);
        done();
      });
    done();
  }).waitForDone();

  /**
   * Post request pass
   */
  test("POST", async ({ expect }, done: Function) => {
    const data = JSON.parse(
      JSON.stringify({
        preference: {
          darkmode: true,
        },
      })
    );

    request(app)
      .post("/api/v1/preference")
      .set(auth)
      .send(data)
      .expect(200)
      .then(async (res) => {
        const json = JSON.parse(res.text);
        expect(json.preference.darkmode).toEqual(data.preference.darkmode);
        done();
      });
    done();
  }).waitForDone();

  /**
   * Post request fail
   */
  test("POST", async ({ expect }, done: Function) => {
    const data = JSON.parse(
      JSON.stringify({
        preference: {
          darkmode: "true",
        },
      })
    );

    request(app)
      .post("/api/v1/preference")
      .set(auth)
      .send(data)
      .expect(422)
      .then(async (res) => {
        const json = JSON.parse(res.text);
        expect(json.status).toEqual(422);
        done();
      });
    done();
  }).waitForDone();
});
