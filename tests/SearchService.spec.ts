import { test } from "@japa/runner";
import { SearchService } from "../app/services/SearchService";

test.group("SearchService", () => {
  /**
   * Test to either get or create database
   */
  test("search pass", ({ expect }) => {
    const search = "The";
    const result = SearchService.searchExercise(search);
    expect(result.results).not.toBe(null);
  }),
    test("search fail", ({ expect }) => {
      const search = ":)_+()#*!";
      const result = SearchService.searchExercise(search);
      expect(result.results).toStrictEqual([]);
    });
});
