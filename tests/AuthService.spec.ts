import { test } from '@japa/runner'
import InvalidCredentialException from '../app/exceptions/InvalidCredentials';
import UnprocessableEntityException from '../app/exceptions/UnprocessableEntityException';
import { AuthService } from "../app/services/AuthService";



test.group('AuthService', () => {
  //base cases for testing
    const uid = "cxarausa"
    const password = "testing"

    const NotfoundUid = "Test@gmail.com"
    const wrongPass = "Test"

  test('Login', async({expect})=>{
    const token = await AuthService.validateLogin(uid, password)
    expect(token).not.toBeNull()
})
/**
 * Testing login
 * when user is not found
 */
test('Login/User not found', async({expect}, done: Function)=>{
    try{
        await AuthService.validateLogin(NotfoundUid, password)
    }catch(e){
        expect(e).toBeInstanceOf(InvalidCredentialException)
        done();
    }
}).waitForDone()
/**
 * Login when password fails
 */
test('Login/No matching password', async({expect}, done: Function)=>{
    try{
        await AuthService.validateLogin(uid, wrongPass)
    }catch(e){
        expect(e).toBeInstanceOf(InvalidCredentialException)
        done();
    }
}).waitForDone()


test('UserName/Password Validation : Success', async({expect}, done: Function)=>{
  
    const testUid = "Test1"
    const testPass = "testPass1"
      await AuthService.validated(testUid, testPass)
  done();
    
}).waitForDone()


test('UserName/Password Validation : Uid failed', async({expect}, done: Function)=>{
  try{
    const testUid = ""
    const testPass ="qweqwe"
      await AuthService.validated(testUid,testPass)
  }catch(e){
      expect(e).toBeInstanceOf(UnprocessableEntityException);
      done();
  }
}).waitForDone()

test('UserName/Password Validation : Pass failed', async({expect}, done: Function)=>{
  try{
    const testUid = "Test1"
    const testPass =""
      await AuthService.validated(testUid,testPass)
  }catch(e){
      expect(e).toBeInstanceOf(UnprocessableEntityException);
      done();
  }
}).waitForDone()

})


