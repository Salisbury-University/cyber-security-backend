import { PrismaClient } from '@prisma/client';
import { marked } from 'marked'
import NotFoundException from '../exceptions/NotFoundException';
import fs from "fs";
const prisma = new PrismaClient()

export const ExericseService = {

  async findInfo(exercise_ID: string, user: string) {
    var exerciseInfo = await prisma.exercise.findFirst({
      where: {
        exercise_ID: exercise_ID,
        user: user
      }
    })
    if (exerciseInfo == null) {
      exerciseInfo = await prisma.exercise.create({
        data: {
          exercise_ID: exercise_ID,
          user: user
        }
      })

      //throw new NotFoundException()
    }
    return exerciseInfo

  },

  getContent(Exercise_ID: string) {

    const fileLocation = "exercises/" + Exercise_ID + ".md";
    try {
      const fileContent = fs.readFileSync(fileLocation, "utf8");
      const form = marked.parse(fileContent)
      var words = form.split("<hr>")
      return words[0] + words[2]
    } catch (e) {
      throw new NotFoundException();
    }

  },

  getMetaData(Exercise_ID: string): Object {
    const fileLocation = "exercises/" + Exercise_ID + ".md";
    try {
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
      throw new NotFoundException
    }

  },

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

  async getDisplay(exercise_ID: string, user: string) {
    try {
      var databaseData = await this.findInfo(exercise_ID, user)
      var content = this.getContent(exercise_ID)
      var metadata = this.getMetaData(exercise_ID)
      var display = {};
  
      display["user"] = databaseData
      display["content"] = content
      display["metadata"] = metadata
      return JSON.parse(JSON.stringify(display))
    } catch(e) {
        return e
    }
  
  }

}