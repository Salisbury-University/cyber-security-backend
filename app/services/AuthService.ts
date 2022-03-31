import express from 'express';
import { config } from "../../config";
import axios, { Axios } from 'axios';

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

    async validateLogin(uid: string, password) {
		
	   var data
		await axios.post('hslinux:38383/api/v1/auth', {
			uid: uid,
			password: password
		  })
		  .then(function (response) {
			data = console.log(response.data);
			
		  })
		  .catch(function (error) {
			if (error.response) {
				console.log(error.response.status);
			  }
		  });
	 	
		  return data;

	}

}