import express from 'express';
import jwt from 'jsonwebtoken';
import { config } from "../../config";
import NotFoundException from "../exceptions/NotFoundException";
import InvalidCredentialException from "../exceptions/InvalidCredentials";
import UserDuplicateException from "../exceptions/UserDuplicateException";
import { prisma } from '@prisma/client';
import axios, { Axios } from 'axios';
import { ref } from 'vue';

const username: any = ref(null)
const password: any = ref(null)
const route: any = ref(null)
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

    async validateLogin(username: string, password) {
		
	   
		axios.post('hslinux:38383/api/v1/auth', {
			uid: 'Fred',
			password: 'Flintstone'
		  })
		  .then(function (response) {
			console.log(response.data);
		  })
		  .catch(function (error) {
			console.log(error);
		  });
	 	
		// const user = await prisma.user.findUnique({
		// 	where: { username: username }
		// });
		
		// //User does not exist
		// if(user == null)
		// 	throw new NotFoundException();

		// //Invalid credentials
		// if(user.password != password)
		// 	throw new InvalidCredentialException();

		// //Create JWT
		// const info = {
		// 	username: user.username,
		// 	password: user.password,
		// }
		// const token = jwt.sign(info, config.auth.ACCESS_TOKEN);
		// return token;
	}

}