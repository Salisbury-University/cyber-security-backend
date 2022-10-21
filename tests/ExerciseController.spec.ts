// import { test } from "@japa/runner";
// import request from "supertest";
// import { app } from "../app";
// import jwt from "jsonwebtoken";

// test.group("ValidationMiddleware", () => {
//   const user = {
//     uid: "1234",
//   };

//   const token = jwt.sign(user, "dadfg");

//   const auth = {
//     Authorization: "Bearer ".concat(token),
//     Accept: "application/json",
//   };

//   test("/getInfo", async ({ expect }, done: Function) => {
//     request(app)
//       .get("/api/v1/exercise/how-to-parse-markdown")
//       .set(auth)
//       .expect(200)
//       .then((res) => {
//         var json = JSON.parse(res.text);
//         expect(json.metadata.title).toMatch("How to parse markdown");
//         done();
//       });
//   }).waitForDone();

//   test("/getInfo/Failed", async ({ expect }, done: Function) => {
//     request(app)
//       .get("/api/v1/exercise/Failed")
//       .set(auth)
//       .expect(404)
//       .then((res) => {
//         expect(res.status).toEqual(404);
//         done();
//       });
//   }).waitForDone();
// });
