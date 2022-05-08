import fs from "fs";
import NotFoundException from "../exceptions/NotFoundException";
import { marked } from "marked";

export const ExercisesService = {
  /**
   * Gets all the exercises from local folder
   *
   * @return {string []} List of all exercises user is able to see
   */
  fetchList(): JSON {
    try {
      const files: string[] = this.getFileName();
      const visibleExercise: string[] = [];

      // Check if it's hidden
      for (let i = 0; i < files.length; i++) {
        const metadata = this.getMetaData(files[i]);
        if (metadata.hidden != true) {
          visibleExercise.push(files[i]);
        }
      }

      return JSON.parse(JSON.stringify({ exercises: visibleExercise }));
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
   */
  getFileName(): string[] {
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

  /** Gets the MetaData from the file
   *
   * @param {string} Exercise_ID id for an exercise
   * @return {Object} the MetaData being returned
   * @throws {NotFoundException} File is Not found exception handler
   */
  getMetaData(Exercise_ID: string): Object {
    try {
      const fileLocation = "exercises/" + Exercise_ID + ".md";
      const fileContent = fs.readFileSync(fileLocation, "utf8");
      const lexer = marked.lexer(fileContent);
      let content = "";
      for (let i = 0; i < lexer.length; i++) {
        if (lexer[i].type == "hr") {
          content = lexer[i + 1].text;
          break;
        }
      }
      //Object to store the key and value
      const metadata = {};

      //Split by enter and get rid of last
      const eachRow = content.split("\n");
      for (let i = 0; i < eachRow.length; i++) {
        // Split between key and value
        const eachCol = eachRow[i].split(": ");
        metadata[eachCol[0]] = this.getDataType(eachCol[1]);
      }
      return metadata;
    } catch (e) {
      throw new NotFoundException();
    }
  },

  /**
   * Gets DataType and splits it up
   *
   * @param {string} s string of datatype
   * @return {any} the data parsed being returned
   */
  getDataType(s: string): any {
    if (s.startsWith("{") && s.endsWith("}")) {
      return Object(s);
    } else if (s.indexOf("/") !== -1 && !isNaN(Date.parse(s))) {
      return new Date(s).toLocaleString();
    } else if (!isNaN(parseFloat(s))) {
      return Number(s);
    } else if (s.startsWith("[") && s.endsWith("]")) {
      s = s.substring(1, s.length - 1);
      const split = s.split(", ");
      for (let i = 0; i < split.length; i++) {
        // Gets rid of double quotation
        split[i] = split[i].substring(1, split[i].length - 1);
      }
      return split;
    } else if (s.toLowerCase() == "true") {
      return Boolean(true);
    } else if (s.toLowerCase() == "false") {
      return Boolean(false);
    } else {
      // Gets rid of double quotation
      s = s.substring(1, s.length - 1);
      return s;
    }
  },
};
