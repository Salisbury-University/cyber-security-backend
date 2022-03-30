import { test } from "@japa/runner";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AuthMiddleware from "../app/http/middleware/AuthMiddleware";

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

  var testData = {
    header: {},
    res: {},
    next: {},
  };

  test("successful run", async ({ expect }, done: Function) => {
    testData = {
      header: {
        authorization: "Bearer " + TOKEN,
      },
      res: jwt.decode(TOKEN, { json: true }),
    };

    AuthMiddleware(
      testData.header as Request,
      testData.res as Response,
      testData.next as NextFunction
    );

    expect(testData.res).toMatchObject(DATA);
  });
});
