import { test } from "@japa/runner";
import UnprocessableEntityException from "../app/exceptions/UnprocessableEntityException";
import { PreferenceService } from "../app/services/PreferenceService";

test.group("PreferenceService", () => {
  const uid = "test1234";
  const data = JSON.parse(
    JSON.stringify({
      preference: {
        darkmode: true,
      },
    })
  );

  const wrongData = JSON.parse(
    JSON.stringify({
      preference: {
        darkmode: "false",
      },
    })
  );

  /**
   * Test to either get or create database
   */
  test("create/get pass", async ({ expect }, done: Function) => {
    const pref = await PreferenceService.getCreatePreference(uid);
    expect(pref.preference.uid).toEqual(uid);
    done();
  }).waitForDone();

  /**
   * Pass instance of update
   */
  test("update pass", async ({ expect }, done: Function) => {
    const pref = await PreferenceService.update(uid, data);
    expect(pref).toEqual(data);
    done();
  }).waitForDone();

  /**
   * Fail instance of update
   */
  test("update fail", async ({ expect }, done: Function) => {
    try {
      const pref = await PreferenceService.update(uid, wrongData);
    } catch (e) {
      expect(e).toBeInstanceOf(UnprocessableEntityException);
      done();
    }
  }).waitForDone();
});
