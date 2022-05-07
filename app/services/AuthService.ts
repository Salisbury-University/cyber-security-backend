import axios from 'axios';
import InvalidCredentialException from '../exceptions/InvalidCredentials';
import { config } from '../../config'
import jwt, { JwtPayload } from "jsonwebtoken";
import JwtMalformedException from "../exceptions/JwtMalformedException";


/**
 * All of the functions regarding authorization
 */
export const AuthService = {

	/**
	 * Validates Login for Username and Password
	 * 
	 * @param uid username
	 * @param password password
	 * @returns token or throws an exception
	 */
	async validateLogin(uid: string, password: string): Promise<String> {
		return await axios.post(config.app.ldap, {
			uid: uid,
			password: password
		})
			.then(function (response) {
				return response.data;
			})
			.catch(function (error) {
				throw new InvalidCredentialException();
			});
	},


  /**
   * Checks if the token starts with Bearer(JWT token) and a spcae afterward
   *
   * @param {String} token Authorization token attached to the HTTP header.
   * @return {boolean} True if their token is valid, false if it isn't.
   */
  validate(token: String): boolean {
    // Space for to check for two words
    const TOKEN_HEADER = "Bearer" + " ";
    if (token.startsWith(TOKEN_HEADER)) {
      return true;
    }
    return false;
  },


  /**
   * Decode the Jsonwebtoken
   *
   * @param {String} token Authorization token attached to the HTTP header
   * @return {JSON} Decoded jsonwebtoken
   * @throws {JwtMalformedException} Throws error when token is malformed or empty
   */
   decodeToken(token: string): User {
    const decoded: JwtPayload = jwt.decode(token, { json: true });
    const PAYLOAD: User = JSON.parse(JSON.stringify(decoded))
    if (PAYLOAD === null) {
      throw new JwtMalformedException();
    }

    // IAT exists but ts kept giving error
    if (PAYLOAD.iat > Date.now()) {
      throw new JwtMalformedException();
    }

    return PAYLOAD;
  },
};

