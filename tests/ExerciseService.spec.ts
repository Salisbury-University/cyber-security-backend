import { test } from '@japa/runner'
import { marked } from 'marked'
import { app } from '../app'
import { ExericseService } from '../app/services/ExerciseService';
import fs from 'fs'
import { userInfo } from 'os';
import NotFoundException from '../app/exceptions/NotFoundException';



test.group('ExerciseService', () => {

   test('/getMetaData', async ({ expect }, done: Function) => {

      var j = ExericseService.getMetaData("how-to-parse-markdown")

      var x = JSON.parse(JSON.stringify(j))
      expect(x.title).toMatch('How to parse markdown')
      done();
   }).waitForDone();

   test('/getMetaData/Failed', async ({ expect }, done: Function) => {
      try {
         var d = ExericseService.getMetaData("how-to-pare-markdown")
      } catch(e) {
         expect(e).toBeInstanceOf(NotFoundException)
         done();
      }

      
   }).waitForDone();


   test('/getContent', async ({ expect }, done: Function) => {
      
      var j = ExericseService.getContent("how-to-parse-markdown")
      
       var x = JSON.parse(JSON.stringify(j))
       console.log(x)
      // expect(x.title).toMatch('How to parse markdown')
      done();

      
   }).waitForDone()


})    
