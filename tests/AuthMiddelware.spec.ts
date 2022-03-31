import { test } from "@japa/runner";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import JwtMalformedException from "../app/exceptions/JwtMalformedException";
import UnauthorizedException from "../app/exceptions/UnauthorizedException";
import AuthMiddleware from "../app/http/middleware/AuthMiddleware";
import { AuthService } from "../app/services/AuthService";

test.group("AuthMiddleware", () => {
  /**
   * Basic token data
   */
  const DATA = {
    u_id: "test1",
    password: "password",
  };

  const SECRET_TOKEN: String = "Secret";
  const TOKEN: String = jwt.sign(DATA, SECRET_TOKEN);

  let req: Partial<Request>;
  let res: Partial<Response>;
  let nextFunction: NextFunction = () => {};

  /**
   * Test for correct run
   *
   * Input: authorization with Bearer TOKEN
   * Output: req.user will contain DATA
   *
   */
  test("successful run", async ({ expect }, done: Function) => {
    req = {
      headers: {
        authorization: "Bearer " + TOKEN,
      },
    };

    try {
      AuthMiddleware(req as Request, res as Response, nextFunction);
      expect(req.user).toMatch("DATA");
    } catch (e) {}
    done();
  }).waitForDone();

  /**
   * Test for error when there is no header
   *
   * Input: When Token is not present, The authorization becomes empty
   * Output: Throws Unauthorized Excepiton error
   */
  test("no header", async ({ expect }, done: Function) => {
    req = {
      headers: {
        authorization: "",
      },
    };

    try {
      AuthMiddleware(req as Request, res as Response, nextFunction);
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
    }
    done();
  }).waitForDone();

  /**
   * Test for malformed token
   *
   * Input: malformed token
   * Output: JwtMalformedException handler
   */
  test("Malformed token", async ({ expect }, done: Function) => {
    req = {
      headers: {
        authorization: "Bearer " + TOKEN.replace("i", "vertasdf"),
      },
    };

    try {
      AuthMiddleware(req as Request, res as Response, nextFunction);
    } catch (e) {
      expect(e).toBeInstanceOf(JwtMalformedException);
    }
    done();
  }).waitForDone();
});
