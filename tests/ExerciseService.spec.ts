import { test } from '@japa/runner'
import {marked} from 'marked'
import {app} from '../app'
import { ExericseService } from '../app/services/ExerciseService';
import fs from 'fs'



test.group('ExerciseService', () => {

  test('/getMetaData', async({expect}, done:Function)=>{

   var j = ExericseService.getMetaData("1111")
   //console.log(JSON.parse('{"key":0}').key)
   const id = "200"

   const status = "incomplete"

   var x = {};
//metadata[eachCol[0]] = this.getDataType(eachCol[1]);
   x["Excercise_ID"] = id;
   x["metadata"] = j;
   x["status"] = status;
   
   console.log(JSON.parse(JSON.stringify(x)))

        done();
        }).waitForDone();
      
})    
