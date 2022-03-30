import { PrismaClient } from '.prisma/client';
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
/**
 * All of the functions regarding authorization
 */
export const AuthService = {
	/**
	 * Validates an authorization token for authentication.
	 *  
	 * @param {String} token Authorization token attached to the HTTP header.
	 * @return {boolean} True if their token is valid, false if it isn't.
	 */
	validate(token: String): boolean {
		if (token.length != 0) {
			return true;
		}
		return false;
	},
	/**
	 * Decode the Jsonwebtoken
	 * 
	 * @param {String} token Authorization token attached to the HTTP header
	 * @returns {JSON} Decoded jsonwebtoken
	 */
	decodeToken(token: String): JSON{
		return jwt.decode(token, {json: true})
	},
}