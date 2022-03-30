import { test } from '@japa/runner'
import { AuthService } from "../app/services/AuthService";
import jwt from 'jsonwebtoken'

test.group('AuthService', () => {
  /**
   * Basic token data
   */
  const data = {
    u_id: "test1",
    password: "password"
  }
  const SECRET_TOKEN = "Secret"
  const token = jwt.sign(data, SECRET_TOKEN)

  /**
   * This is place holder for now. Once LDAP is able to run will replace this
   */
  test('Token validation', ({ expect }) => {
    // Test logic goes here
    expect(AuthService.validate("Hello world")).toEqual(true);
  })

  /**
   * Testing JWT decode function.
   */
  test('JWT_decode', ({expect})=>{
    expect(AuthService.decodeToken(token)).toContain(data)

  })
})
