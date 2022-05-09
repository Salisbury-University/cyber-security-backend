import { marked } from "marked";
import NotFoundException from "../exceptions/NotFoundException";
import fs from "fs";

export const ExerciseService = {
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
