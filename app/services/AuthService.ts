import express from 'express';
import axios from 'axios';
import InvalidCredentialException from '../exceptions/InvalidCredentials';
import UnprocessableEntityException from '../exceptions/UnprocessableEntityException';
import { z } from 'zod';

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


	validated(uid: string , password: string) {

		try {
			const zUid = z.string().min(1);
			const zPassword = z.string().min(1);

			zUid.parse(uid)
			zPassword.parse(password)
		}
		catch (e) {
			throw new UnprocessableEntityException(String(e));

		}
	}

}