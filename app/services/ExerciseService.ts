import { PrismaClient } from '@prisma/client';
import {marked} from 'marked'
import NotFoundException from '../exceptions/NotFoundException';
import fs from "fs";
const prisma = new PrismaClient()

export const ExericseService = {

async findInfo(exercise_ID: string, user: string) {
    var exerciseInfo = await prisma.exercise.findFirst({
        where:{
            exercise_ID: exercise_ID,
            user: user
        }
    })
    if(exerciseInfo == null) {
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

 getContent(exercise_ID: string) {
  const fileLocation = "exercises/how-to-parse-markdown.md";
  const fileContent = fs.readFileSync(fileLocation, "utf8");
  const form = marked.parse(fileContent)
  var words = form.split("<hr>")
 return words[0] + words[2]
},

//  getMetaData(vmid: string): string {
//      const fileLocation = "exercises/how-to-parse-markdown.md";
//      const fileContent = fs.readFileSync(fileLocation, "utf8");
//      const lexer = marked.lexer(fileContent);
//      let content = "";
//      for (let i = 0; i < lexer.length; i++) {
//        if (lexer[i].type == "hr") {
//          content = lexer[i + 1].raw;
//          break;
//        }
//      }
//      console.log(content)
//      const key:string[] = [];
//      const value:string[] = [];
//      //Split by enter and get rid of last
//      const eachRow = content.split("\n");
//      for (let i = 0; i < eachRow.length; i++) {
//        // Split between key and value
//        const eachCol = eachRow[i].split(":");
//        key.push(eachCol[0]);
//        value.push(eachCol[1]);
//      }
  
//      let returnString = "{";
//      // Concat the key and value back to be encoded as json in future
//      for (let i = 0; i < key.length - 1; i++) {
//        returnString = returnString.concat('"', key[i], '": ', value[i], ",");
//      }
//      returnString = returnString.substring(0, returnString.length - 2);
//      returnString = returnString.concat("}");
//      returnString = JSON.stringify(returnString);
//      return returnString;
 // },

 getMetaData(Excercise_ID: string): Object {
  const fileLocation = "exercises/how-to-parse-markdown.md";
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

async getDisplay(exercise_ID:string, user: string ) {
var databaseData = await this.findInfo(exercise_ID, user)
var content = this.getContent(exercise_ID)
var metadata = this.getMetaData(exercise_ID)
var display ={};

display["user"] = databaseData
display["content"] = content
display["metadata"] = metadata
return JSON.parse(JSON.stringify(display))
}

}