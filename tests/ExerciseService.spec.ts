import { test } from '@japa/runner'
import {marked} from 'marked'
import {app} from '../app'
import { ExericseService } from '../app/services/ExerciseService';
import fs from 'fs'
import { userInfo } from 'os';



test.group('ExerciseService', () => {

  test('/getMetaData', async({expect}, done:Function)=>{
   var p = await ExericseService.findInfo("111", "chris")
   var j = ExericseService.getMetaData("1111")
   var w = ExericseService.getContent("asd")
   var t = await ExericseService.getDisplay("sa" , "ll")
   const fileLocation = "exercises/how-to-parse-markdown.md";
  const fileContent = fs.readFileSync(fileLocation, "utf8");
  const form = marked.parse(fileContent)
   console.log(t)
   //console.log(JSON.parse('{"key":0}').key)
   const id = "200"

   const status = "incomplete"

   var x = {};
//metadata[eachCol[0]] = this.getDataType(eachCol[1]);
   x["Excercise_ID"] = id;
   x["metadata"] = j;
   x["status"] = status;
   
  // console.log(JSON.parse(JSON.stringify(x)))

        done();
        }).waitForDone();
      
})    
