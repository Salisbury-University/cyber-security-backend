import { test } from '@japa/runner'

import { ExericseService } from '../app/services/ExerciseService';
import NotFoundException from '../app/exceptions/NotFoundException';


test.group('ExerciseService', () => {

  test('/getMetaData', async ({ expect }, done: Function) => {

    var metaData = ExericseService.getMetaData("how-to-parse-markdown")

    var json = JSON.parse(JSON.stringify(metaData))
    expect(json.title).toMatch('How to parse markdown')
    done();
  }).waitForDone();

  test('/getMetaData/Failed', async ({ expect }, done: Function) => {
    try {
      ExericseService.getMetaData("Failed")
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException)
      done();
    }

  }).waitForDone();


  test('/getContent', async ({ expect }, done: Function) => {

    var content = ExericseService.getContent("how-to-parse-markdown")

    var json = JSON.parse(JSON.stringify(content))
    expect(json).not.toBeNull()

    done();


  }).waitForDone()


  test('/getContent/Failed', async ({ expect }, done: Function) => {

    try {
      ExericseService.getContent("Failed")
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException)
      done();
    }

  }).waitForDone()


  test('/fetchData', async ({ expect }, done: Function) => {

    var display = ExericseService.fetchData("how-to-parse-markdown")

    var json = JSON.parse(JSON.stringify(display))

    expect(json.metadata.title).toMatch("How to parse markdown")
    done();

  }).waitForDone()

  test('/fetchData/Failed', async ({ expect }, done: Function) => {

    try {
      ExericseService.fetchData("Failed")
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException)
      done();
    }
    done();
  }).waitForDone()
})    
