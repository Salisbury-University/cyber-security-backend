import { PrismaClient } from '@prisma/client';
import {marked} from 'marked'
import NotFoundException from '../exceptions/NotFoundException';
import fs from "fs";
const prisma = new PrismaClient()

export const ExericseService = {

async findInfo(exercise_ID, user) {
    const exerciseInfo = await prisma.exercise.findFirst({
        where:{
            exercise_ID: exercise_ID,
            user: user
        }
    })
    if(exerciseInfo == null) {
			throw new NotFoundException()
    }
    if(exerciseInfo.status == "complete") {

    }
    
    return exerciseInfo
    
},

getMetaData(vmid: string): string {
    const fileLocation = "exercises/how-to-parse-markdown.md";
    const fileContent = fs.readFileSync(fileLocation, "utf8");
    const lexer = marked.lexer(fileContent);
    let content = "";
    for (let i = 0; i < lexer.length; i++) {
      if (lexer[i].type == "hr") {
        content = lexer[i + 1].raw;
        break;
      }
    }
    console.log(content)
    const key:string[] = [];
    const value:string[] = [];
    //Split by enter and get rid of last
    const eachRow = content.split("\n");
    for (let i = 0; i < eachRow.length; i++) {
      // Split between key and value
      const eachCol = eachRow[i].split(":");
      key.push(eachCol[0]);
      value.push(eachCol[1]);
    }
  
    let returnString = "{";
    // Concat the key and value back to be encoded as json in future
    for (let i = 0; i < key.length - 1; i++) {
      returnString = returnString.concat('"', key[i], '": ', value[i], ",");
    }
    returnString = returnString.substring(0, returnString.length - 2);
    returnString = returnString.concat("}");
    returnString = JSON.stringify(returnString);
    return returnString;
  },

}