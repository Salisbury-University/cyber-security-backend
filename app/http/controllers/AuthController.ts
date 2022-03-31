import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../services/AuthService";
import axios, { Axios } from "axios";
import NotFoundException from "../../exceptions/NotFoundException";


export const AuthController = {

/**
	 * Handles the default request on /
	 * 
	 * @param req {Request} Express request object
	 * @param res {Response} Express response object
	 * @param next {NextFunction} Express NextFunction (used for middleware)
	 */

    
 async login(req: Request, res: Response, next: NextFunction) {

    try {
        let uid = req.body.uid
        if (!uid)
            uid = req.body.uid
        if (!req.body.password)
            throw new NotFoundException

        const token = await AuthService.validateLogin(uid, req.body.password)
    }
    catch (e) {
        return next(e)
    }
        
    },

}