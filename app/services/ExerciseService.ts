import { marked } from "marked";
import { PrismaClient } from "@prisma/client";
import { ExercisesService } from "./ExercisesService";
import fs from "fs";
import NotFoundException from "../exceptions/NotFoundException";
import UnprocessableEntityException from "../exceptions/UnprocessableEntityException";

const prisma = new PrismaClient();

export const ExerciseService = {
  /**
   * Gets the content from the file
   *
   * @param {string} exerciseTitle title of the exercise
   * @return {string} the content being returned
   * @throws {NotFoundException} File is Not found exception handler
   */
  getContent(exerciseTitle: string): string {
    console.log("GET CONTENT \t" + Date());
    const filename = this.findFilename(exerciseTitle);
    const fileLocation = "exercises/" + filename + ".md";
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
   * @param {string} exerciseTitle title of the exercise
   * @return {any} the MetaData being returned
   * @throws {NotFoundException} File is Not found exception handler
   */
  getMetaData(exerciseTitle: string): any {
    const filename = this.findFilename(exerciseTitle);
    const fileLocation = "exercises/" + filename + ".md";
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
   * Gets the MetaData from the file
   *
   * @param {string} filename filename of the exercise
   * @return {any} the MetaData being returned
   * @throws {NotFoundException} File is Not found exception handler
   */
  getMetaDataFromFile(filename: string): any {
    const fileLocation = "exercises/" + filename + ".md";
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
   * @param {string} dataString string to convert to corresponding datatype
   * @return {any} the data parsed being returned
   */
  getDataType(dataString: string): any {
    if (dataString.startsWith("{") && dataString.endsWith("}")) {
      return Object(dataString);
    } else if (
      dataString.indexOf("/") !== -1 &&
      !isNaN(Date.parse(dataString))
    ) {
      return new Date(dataString).toLocaleString();
    } else if (!isNaN(parseFloat(dataString))) {
      return Number(dataString);
    } else if (dataString.startsWith("[") && dataString.endsWith("]")) {
      dataString = dataString.substring(1, dataString.length - 1);
      const split = dataString.split(", ");
      for (let i = 0; i < split.length; i++) {
        // Gets rid of double quotation
        split[i] = split[i].substring(1, split[i].length - 1);
      }
      return split;
    } else if (dataString.toLowerCase() == "true") {
      return Boolean(true);
    } else if (dataString.toLowerCase() == "false") {
      return Boolean(false);
    } else {
      // Gets rid of double quotation
      dataString = dataString.substring(1, dataString.length - 1);
      return dataString;
    }
  },

  /**
   * gets status of the exercise
   *
   * @param {string} exerciseTitle title of the exercise
   * @return {JSON} the JSON being returned
   * @throws {NotFoundException} File is Not found exception handler
   */
  async getStatus(
    uid: string,
    exerciseTitle: string
  ): Promise<String | boolean> {
    console.log("START GET STATUS");
    let status = "";

    // Check if exercise exist in database
    let exerciseStatus = await prisma.exercise.findFirst({
      where: {
        exerciseID: exerciseTitle,
        user: uid,
      },
    });
    if (exerciseStatus == null) {
      try {
        // If user logged is logged in create the new row
        if (uid !== "" && uid !== undefined) {
          exerciseStatus = this.createDB(uid, exerciseTitle);
          status = exerciseStatus.status;
        } else {
          status = "incomplete";
        }
      } catch (e) {
        throw new UnprocessableEntityException();
      }
    } else {
      status = exerciseStatus.status;
    }

    return status;
  },

  async updateStatus(uid: string, exerciseTitle: string, status: string) {
    try {
      const user = await prisma.exercise.update({
        where: {
          exerciseID_user: {
            exerciseID: exerciseTitle,
            user: uid,
          },
        },
        data: {
          status: status,
        },
      });
    } catch (e) {
      return e;
    }
  },

  /**
   * creates an entry in the database.
   *
   * @param {string} exerciseTitle title of the exercise
   * @return {JSON} the JSON being returned
   * @throws {UnprocessableEntityException} Contains a default error message and sets the HTTP response status
   */
  async createDB(
    uid: string,
    exerciseTitle: string,
    status: string = "incomplete"
  ): Promise<void | UnprocessableEntityException> {
    console.log("CREATE DB \t" + Date());
    try {
      const user = await prisma.exercise.create({
        data: {
          exerciseID: exerciseTitle,
          user: uid,
          status: status,
        },
      });
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  },

  /**
   * Fetches content, metadata, and status.
   *
   * @param {string} exerciseTitle title of the exercise
   * @return {JSON} the JSON being returned
   * @throws {NotFoundException} File is Not found exception handler
   */
  fetchData(uid: string, exerciseTitle: string): string {
    try {
      const content = this.getContent(exerciseTitle);
      const metadata = this.getMetaData(exerciseTitle);
      const status = this.getStatus(uid, exerciseTitle);
      const display = {};

      display["content"] = content;
      display["metadata"] = metadata;
      display["status"] = status;

      return JSON.parse(JSON.stringify(display));
    } catch (e) {
      throw new NotFoundException();
    }
  },

  /**
   * returns file name from the title
   *
   * @param {string} exerciseTitle - title of the exercise
   * @returns {string} filename
   */
  findFilename(exerciseTitle: string): string {
    const files = ExercisesService.getAllExerciseFilename();
    for (let i = 0; i < files.length; i++) {
      const currFile = files[i];

      const metadata = this.getMetaDataFromFile(currFile);
      if (metadata.title === exerciseTitle) {
        return currFile;
      }
    }
  },
};
