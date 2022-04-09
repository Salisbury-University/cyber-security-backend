import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../services/AuthService";


export const AuthController = {
	/**
	 * Handles the login request
	 * 
	 * @param req {Request} Express request object
	 * @param res {Response} Express response object
	 * @param next {NextFunction} Express NextFunction (used for middleware)
	 */
	 async login(req: Request, res: Response, next: NextFunction) {
		try {
			const dat = await AuthService.validateLogin(req.body.uid, req.body.password)
			res.send(dat)
		} catch (error) {
			return next(error);
		}
	},
}