import request from "supertest";
import { app } from "../app";
import { test } from "@japa/runner";
import jwt from "jsonwebtoken";
import UnauthorizedException from "../app/exceptions/UnauthorizedException";

test.group("AuthMiddleware", () => {
  const uid = { uid: "test1234" };
  const token = jwt.sign(uid, "asdf");
  const unauth = new UnauthorizedException().status;

  /**
   * Successful test
   */
  test("Success", async ({ expect }, done: Function) => {
    const auth = {
      Authorization: "Bearer ".concat(token),
      Accept: "application/json",
    };

    request(app)
      .get("/api/v1/preference")
      .set(auth)
      .expect(200)
      .then(async (res) => {
        expect(res.status).toEqual(200);
        done();
      });
    done();
  }).waitForDone();

  /**
   * No authorization token
   */
  test("No Authorization", async ({ expect }, done: Function) => {
    const auth = {
      Accept: "application/json",
    };

    request(app)
      .get("/api/v1/preference")
      .set(auth)
      .expect(401)
      .then(async (res) => {
        expect(res.status).toEqual(unauth);
        done();
      });
    done();
  }).waitForDone();

  /**
   * Token does not start with bearer
   */
  test("No bearer in front", async ({ expect }, done: Function) => {
    const auth = {
      Authorization: token,
      Accept: "application/json",
    };

    request(app)
      .get("/api/v1/preference")
      .set(auth)
      .expect(401)
      .then(async (res) => {
        expect(res.status).toEqual(unauth);
        done();
      });
    done();
  }).waitForDone();

  /**
   * One word authorization
   */
  test("Token is one word", async ({ expect }, done: Function) => {
    const auth = {
      Authorization: "Bearer".concat(token),
      Accept: "application/json",
    };

    request(app)
      .get("/api/v1/preference")
      .set(auth)
      .expect(401)
      .then(async (res) => {
        expect(res.status).toEqual(unauth);
        done();
      });
    done();
  }).waitForDone();
});
