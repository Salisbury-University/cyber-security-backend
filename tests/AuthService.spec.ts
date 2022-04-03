import { test } from "@japa/runner";
import { AuthService } from "../app/services/AuthService";
import jwt from "jsonwebtoken";
import JwtMalformedException from "../app/exceptions/JwtMalformedException";

test.group("AuthService", () => {
  /**
   * Basic token data
   */
  const DATA = {
    u_id: "test1",
    password: "password",
  };

  const SECRET_TOKEN: String = "Secret";
  const TOKEN: String = jwt.sign(DATA, SECRET_TOKEN);

  /**
   * Testing JWT decode function.
   */
  test("JWT success decode", ({ expect }) => {
    expect(AuthService.decodeToken(TOKEN)).toMatchObject(DATA);
  });

  /**
   * Test when token has been altered
   */
  test("JWT malformed token", async ({ expect }, done: Function) => {
    const RANDOM = TOKEN.concat("ljas;dlkfj;al");
    try {
      await AuthService.decodeToken(RANDOM);
    } catch (e) {
      expect(e).toBeInstanceOf(JwtMalformedException);
      done();
    }
  }).waitForDone();

  /**
   * Testing when token is empty
   */
  test("JWT empty token", async ({ expect }, done: Function) => {
    const EMPTY_TOKEN: String = "";
    try {
      await AuthService.decodeToken(EMPTY_TOKEN);
    } catch (e) {
      expect(e).toBeInstanceOf(JwtMalformedException);
      done();
    }
  }).waitForDone();

  /**
   * Iat is later than current time
   * Iat is calculated by adding seconds to current time from Jan. 1. 1970 at 12:00 AM
   * Date.now() shows Date of current in milliSeconds so it is divided in 1000 to make it in to seconds
   */
  test("JWT iat error", async ({ expect }, done: Function) => {
    // Alter iat to fail
    const DECODED = jwt.decode(TOKEN);
    DECODED.iat += 1000;

    // Resign the Token with altered iat
    const NEW_TOKEN = jwt.sign(DECODED, SECRET_TOKEN);

    // Current time
    const CURRENT_TIME = Math.floor(Date.now() / 1000);

    try {
      await AuthService.decodeToken(NEW_TOKEN);
    } catch (e) {
      expect(e).toBeInstanceOf(JwtMalformedException);
      done();
    }
  }).waitForDone();
});
