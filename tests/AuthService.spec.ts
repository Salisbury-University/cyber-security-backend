import { test } from '@japa/runner'
import InvalidCredentialException from '../app/exceptions/InvalidCredentials';
import { AuthService } from "../app/services/AuthService";

test.group('AuthService', () => {
  //base cases for testing
  const uid = "cxarausa"
  const password = "testing"

  const NotfoundUid = "Test@gmail.com"
  const wrongPass = "Test"

  test('Login', async ({ expect }, done: Function) => {
    const token = await AuthService.validateLogin(uid, password)
    expect(token).not.toBeNull()
    done();
  }).waitForDone();
  /**
   * Testing login
   * when user is not found
   */
  test('Login/User not found', async ({ expect }, done: Function) => {
    try {
      await AuthService.validateLogin(NotfoundUid, password)
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidCredentialException)
      done();
    }
  }).waitForDone()
  /**
   * Login when password fails
   */
  test('Login/No matching password', async ({ expect }, done: Function) => {
    try {
      await AuthService.validateLogin(uid, wrongPass)
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidCredentialException)
      done();
    }
  }).waitForDone()

})


