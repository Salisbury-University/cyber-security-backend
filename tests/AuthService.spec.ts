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
   * This is place holder for now. Once LDAP is able to run will replace this
   */
  test("Token validation", ({ expect }) => {
    // Test logic goes here
    expect(AuthService.validate("Hello world")).toEqual(true);
  });

  /**
   * Testing JWT decode function.
   */
  test("JWT success decode", ({ expect }) => {
    expect(AuthService.decodeToken(TOKEN)).toMatchObject(DATA);
  });

  /**
   * Test when token has been altered
   */
  test("JWT malformed token", ({ expect }) => {
    try {
      AuthService.decodeToken(TOKEN.replace("i", "vert"));
    } catch (e) {
      expect(e).toBeInstanceOf(JwtMalformedException);
    }
  });

  /**
   * Testing when token is empty
   */
  test("JWT empty token", ({ expect }) => {
    const EMPTY_TOKEN: String = "";
    try {
      AuthService.decodeToken(EMPTY_TOKEN);
    } catch (e) {
      expect(e).toBeInstanceOf(JwtMalformedException);
    }
  });
});
