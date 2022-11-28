import fs from "fs";
import { ExerciseService } from "./ExerciseService";
import NotFoundException from "../exceptions/NotFoundException";

export const ExercisesService = {
  /**
   * Fetch number of exercise on page
   *
   * @param {string} page page string from params
   * @param {number} max maximumm exercise per page
   * @return {string []} List of exercise in max number
   * @throws {NotFoundException} Throws not found exception when exceeding max number
   */
  fetchPage(page: string, pagination: number): string[] {
    try {
      const max: number = pagination;
      const pageNumber: number = Number(page) - 1;

      const list: string[] = this.fetchList();
      const maxLength: number = list.length;
      const visibleExercise: string[] = [];
      // Check if page exceed maxlength
      if (pageNumber * max > maxLength) {
        throw new NotFoundException();
      }
      // Start from page*max ex. 0 * 5 = 0
      // and end at the first max page ex. 0 * 5 + 5 = 5
      for (let i = pageNumber * max; i < pageNumber * max + max; i++) {
        if (i >= maxLength) {
          break;
        }
        visibleExercise.push(list[i]);
      }

      return visibleExercise;
    } catch (e) {
      if (e.status == 404) {
        throw new NotFoundException();
      }
    }
  },

  /**
   * Gets all the exercises from local folder and return the filename
   *
   * @return {string []} List of all exercises user is able to see
   * @throws {NotFoundException} returns when function fails
   */
  fetchList(): string[] {
    try {
      const files: string[] = this.getAllExerciseFilename();
      const visibleExercise: string[] = [];

      // Check if it's hidden
      for (let i = 0; i < files.length; i++) {
        const metadata = ExerciseService.getMetaData(files[i]);
        const json = JSON.parse(JSON.stringify(metadata));
        if (json.hidden != true) {
          visibleExercise.push(files[i]);
        }
      }

      return visibleExercise;
    } catch (e) {
      if (e.status == 404) {
        throw new NotFoundException();
      }
    }
  },

  /**
   * Gets all the file names in exercise folder
   *
   * @return {string[]} List of exercises in the folder
   * @throws {NotFoundException} Throws error when folder does not exist
   */
  getAllExerciseFilename(): string[] {
    try {
      const returnFiles: string[] = [];

      // Start from __dirname since it is from abolute path
      const folderLocation = __dirname + "/../../exercises";
      const files: string[] = fs.readdirSync(folderLocation);
      for (let i = 0; i < files.length; i++) {
        // Get files name without extension
        returnFiles.push(files[i].split(".")[0]);
      }
      return returnFiles;
    } catch (e) {
      throw new NotFoundException();
    }
  },
};
