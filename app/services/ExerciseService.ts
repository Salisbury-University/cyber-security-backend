import { marked } from "marked";
import NotFoundException from "../exceptions/NotFoundException";
import fs from "fs";
import { string } from "zod";
import { PrismaClient } from "@prisma/client";
import UnprocessableEntityException from "../exceptions/UnprocessableEntityException";

const prisma = new PrismaClient();

export const ExerciseService = {
  /**
   * Gets the content from the file
   *
   * @param {string} exerciseID id for an exercise
   * @return {string} the content being returned
   * @throws {NotFoundException} File is Not found exception handler
   */
  getContent(exerciseID: string): string {
    const fileLocation = "exercises/" + exerciseID + ".md";
    try {
      const fileContent = fs.readFileSync(fileLocation, "utf8");
      const form = marked.parse(fileContent);
      //splits to get content and metaData
      var words = form.split("<hr>");
      //returns the content before and after the metaData
      return words[0] + words[2];
    } catch (e) {
      throw new NotFoundException();
    }
  },

  /**
   * Gets the MetaData from the file
   *
   * @param {string} exerciseID id for an exercise
   * @return {Object} the MetaData being returned
   * @throws {NotFoundException} File is Not found exception handler
   */
  getMetaData(exerciseID: string): Object {
    const fileLocation = "exercises/" + exerciseID + ".md";
    try {
      const fileContent = fs.readFileSync(fileLocation, "utf8");
      const lexer = marked.lexer(fileContent);
      let content = "";

      for (let i = 0; i < lexer.length; i++) {
        if (lexer[i].type == "hr") {
          //i+1 after hr from lexer, holds the information from the frontmatter
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
   * @param {string} exerciseID id for an exercise
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
    } else if (s.toLowerCase() == "true" || s.toLowerCase() == "false") {
      return Boolean(s);
    } else {
      // Gets rid of double quotation
      s = s.substring(1, s.length - 1);
      return s;
    }
  },

  /**
   * gets status of the problem
   *
   * @param {string} exerciseID id for an exercise
   * @return {JSON} the JSON being returned
   * @throws {NotFoundException} File is Not found exception handler
   */
  async getStatus(uid: string, exerciseID: string) {
    const exerciseStatus = await prisma.exercise.findFirst({
      where: {
        exerciseID: exerciseID,
        user: uid,
      },
    });
    if (exerciseStatus == null) {
      return false;
    }

    return exerciseStatus.status;
  },

  /**
   * creates a Database.
   *
   * @param {string} exerciseID id for an exercise
   * @return {JSON} the JSON being returned
   * @throws {NotFoundException} File is Not found exception handler
   */
  async createDB(
    uid: string,
    exerciseID: string,
    status: string = "incomplete"
  ) {
    try {
      const user = await prisma.exercise.create({
        data: {
          exerciseID: exerciseID,
          user: uid,
          status: status,
        },
      });
    } catch (e) {
      return e;
      throw new UnprocessableEntityException();
    }
  },

  /**
   * Fetches content, metadata, and status.
   *
   * @param {string} exerciseID id for an exercise
   * @return {JSON} the JSON being returned
   * @throws {NotFoundException} File is Not found exception handler
   */
  fetchData(uid: string, exerciseID: string) {
    try {
      const content = this.getContent(exerciseID);
      const metadata = this.getMetaData(exerciseID);
      const status = this.getStatus(uid, exerciseID);
      const display = {};

      display["content"] = content;
      display["metadata"] = metadata;
      display["status"] = status;

      return JSON.parse(JSON.stringify(display));
    } catch (e) {
      throw new NotFoundException();
    }
  },
};
