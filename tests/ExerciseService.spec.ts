import { test } from '@japa/runner'
import {marked} from 'marked'
import {app} from '../app'
import { ExericseService } from '../app/services/ExerciseService';
import fs from 'fs'



test.group('ExerciseService', () => {

  test('/getMetaData', async({expect}, done:Function)=>{

   var j = ExericseService.getMetaData("1111")

   console.log(JSON.parse('{"key":0}').key)
   console.log(JSON.parse(j).title)
   console.log(j)
    //console.log(JSON.parse(j))
  //   var string1 = ""
  //  string1 = fs.readFileSync('exercises/how-to-parse-markdown.md', 'utf8' ) 
  //   var username = 'cxarausa'
  //   var exercise_ID = "1111"
  //   test('markedLogin', async ({ expect }, done: Function) => {
  //      var mark = "# test"
  //      var result = marked.parse(string1)
  //      var try1 = result.split("<hr>")
  //      console.log(try1[0] + try1[2])
  //      var result1 = marked.lexer(string1)
  //      for(var i = 0; i < result1.length; i++) {
  //          if(result1[i].type == "hr") {
  //           var data1 = result1[i+1].raw
  //              console.log(result1[i+1].raw)
  //               break;
  //           }
  //      }

      //console.log(data1.split('\n'))
     // console.log(JSON.parse(JSON.stringify(data1.split('\n'))))
    //   var d = data1.split('\n')
    //   var k = "{";
    //   for(var i = 0; i < d.length; i++) {
    //     k +=d[i];
    //     k += ','
    //   }
    // k += "}"
      // console.log(JSON.parse(k))
      // var data2 = {metadata: [data1]}
       // console.log(eval(data2))
       // var j = JSON.parse(JSON.stringify(
         //  data1
       // ))
     
        //console.log(j.title)
        done();
        }).waitForDone();
})    
