// import { test } from '@japa/runner'
// import request  from 'supertest'
// import {app} from '../app'
// import jwt from 'jsonwebtoken'

// test.group('AuthController', () => {

// const body = {
//     username: 'cxarausa',
//     password : 'testing'
// }
// /**
//      * Testing the registration of user api call
//      */
//  test('/Login', async({expect}, done:Function)=>{
//     request(app)
//         .post('/auth/login')
//         .send(body)
//         .set('Accept', 'application/json')
//         .expect(200)
//         .then((res)=>{
//             const decode = jwt.decode(res.body.token, {json: true})
//             expect(decode).toMatchObject({uid: body.username})
//             done()
//         })
// }).waitForDone()

// /**
//      * Testing the UserLogin invalid credentials of user api call
//      */
// test('/LoginFailed', async({expect}, done:Function)=>{
//     request(app)
//         .post('/auth/login')
//         .send({
//             username: "aaa",
//             password: "sgs"
//         })
//         .set('Accept', 'application/json')
//         .expect(422,done)
// }).waitForDone()

// })
