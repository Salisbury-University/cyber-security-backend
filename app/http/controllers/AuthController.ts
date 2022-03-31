import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../services/AuthService";
import axios, { Axios } from "axios";
import { ref } from 'vue'

export const AuthController = {

/**
	 * Handles the default request on /
	 * 
	 * @param req {Request} Express request object
	 * @param res {Response} Express response object
	 * @param next {NextFunction} Express NextFunction (used for middleware)
	 */

    
 async login(req: Request, res: Response, next: NextFunction) {

    const data = {
        username: this.username,
        password: this.password
    };

    axios.post('hslinux:38383/api/v1/auth', data) 
        .then(res=> {
            console.log(res) 
        })
        .catch(err => {
            console.log(err)
        })
    },

}