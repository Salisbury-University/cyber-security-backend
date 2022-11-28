import { test } from "@japa/runner";
import NotFoundException from "../app/exceptions/NotFoundException";
import { ExercisesService } from "../app/services/ExercisesService";

test.group("ExercisesService", () => {
  const pagination: number = 5;
  /**
   * Testing for fetch pagination
   * */
  test("fetchPage: Pass", async ({ expect }, done: Function) => {
    const page: string = "1";
    const list = ExercisesService.fetchPage(page, pagination);
    expect(list.length).toBeLessThanOrEqual(pagination);
    done();
  }).waitForDone();

  /**
   * No exercises in the page
   * */
  test("fetchPage: Fail no return exercises", async ({
    expect,
  }, done: Function) => {
    try {
      // The page will never have that 9999999999 number of pages
      const page: string = "9999999999";
      ExercisesService.fetchPage(page, pagination);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      done();
    }
  }).waitForDone();
});
