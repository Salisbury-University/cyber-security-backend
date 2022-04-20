import { test } from '@japa/runner'
import {marked} from 'marked'
import {app} from '../app'
import { ExericseService } from '../app/services/ExerciseService';
import fs from 'fs'

test.group('ExerciseService', () => {
    var string1 = ""
    fs.readFile('tests/test-test.md', 'utf8', function(error, f){
        string1 = f
        console.log(f)
    })
    console.log(string1)
    var username = 'cxarausa'
    var exercise_ID = "1111"
    test('markedLogin', async ({ expect }, done: Function) => {
       var mark = "# test"
       var result = marked.parse(string1)
       var try1 = result.split("<hr>")
       console.log(result)
       console.log(try1[0] + try1[2])
       var result1 = marked.lexer(string1)
       console.log(result)
       var metadata = {
       }
        done();
        }).waitForDone();
})    
