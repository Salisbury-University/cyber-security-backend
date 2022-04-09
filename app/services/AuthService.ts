import axios from 'axios';
import InvalidCredentialException from '../exceptions/InvalidCredentials';

/**
 * An example of an authorization service to validate authorization tokens, or attempt sign ins.
 */
export const AuthService = {
	/**
	 * Validates an authorization token for authentication.
	 *  
	 * @param token Authorization token attached to the HTTP header.
	 * @return {boolean} True if their token is valid, false if it isn't.
	 */
	validate(token: String): boolean {
		if (token.length != 0) {
			return true;
		}
		return false;
	},

	/**
	 * Validates Login for Username and Password
	 * 
	 * @param uid username
	 * @param password password
	 * @returns token or throws an exception
	 */
	async validateLogin(uid: string, password: string) {
		return await axios.post('http://hslinux:38383/api/v1/auth', {
			uid: uid,
			password: password
		})
			.then(function (response) {
				return response.data.token;
			})
			.catch(function (error) {
				throw new InvalidCredentialException();
			});
	},
}