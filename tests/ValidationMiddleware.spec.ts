// import { test } from '@japa/runner'
// import request  from 'supertest'
// import {app} from '../app'
// import jwt from 'jsonwebtoken'

// test.group('ValidationMiddleware', () => {

// const body = {
//     username : "cxarausa",
//     password : "testing"
// }    
// /**
//      * Testing the registration of user api call
//      */
//  test('/Login', async({expect}, done:Function)=>{
//     request(app)
//         .post('/auth/login')
//         .set('Accept', 'application/json')
//         .expect(200)
//         .send(body)
//         .then(async(res)=>{
//             const decode = jwt.decode(res.text, {json: true})
//             expect(decode).toMatchObject({uid: body.username})
//             done()
//         })
// }).waitForDone()

// })