import e, { NextFunction, Request, Response } from "express";
import { AuthService } from "../../services/AuthService";
import axios from "axios";
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

    axios.post("http://hslinux:38383/api/v1/auth", {
			uid: req.body.uid,
			password: req.body.password
		  }).then((response) => {res.send(response.data.token)})

    .catch(function (error) {
            res.send(error)
    })



}
}