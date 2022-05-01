import request from "supertest";
import { app } from "../app";
import { test } from "@japa/runner";
import jwt from "jsonwebtoken";

test.group("AuthMiddleware", () => {
  const uid = { uid: "test1234" };
  const token = jwt.sign(uid, "asdf");

  test("JWT deformed");
});
