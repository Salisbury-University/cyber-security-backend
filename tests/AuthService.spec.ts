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
});
