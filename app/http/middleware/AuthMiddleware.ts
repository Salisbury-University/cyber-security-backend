import { NextFunction, Request, Response } from "express";
import {AuthService} from '../../services/AuthService'
import UnauthorizedException from '../../exceptions/UnauthorizedException'

/**
 * An example of authentication middleware to create authorized views / routes.
 * 
 * @param req {Request} Express request object
 * @param res {Response} Express response object
 * @param next {NextFunction} Express next function
 */
export default async function (req: Request, res: Response, next: NextFunction) {
	// Get the second half of the authorization header
	// Example header: Bearer akviakocalkw123kavniwa
	const token = req.headers.authorization.split(" ")[1]

	// If the auth service doesn't validate the user	
	if (!AuthService.validate(token)) {
		return next(new UnauthorizedException());
	}

	// Assign user information
	req.user = AuthService.decodeToken(token);

	// Go to the next middleware / controller
	return next()
}