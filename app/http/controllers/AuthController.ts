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

  async Login(req: Request, res: Response, next: NextFunction) {
    try {
      const token = await AuthService.ldapJs(
        req.body.username,
        req.body.password
      );
      res.send({ token: token });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Handles the logout request
   *
   * @param req {Request} Express request object
   * @param res {Response} Express response object
   * @param next {NextFunction} Express NextFunction (used for middleware)
   */

  async Logout(req: Request, res: Response, next: NextFunction) {
    const authoraizationToken = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : "";
    const token = await AuthService.Logout(authoraizationToken);

    res.send("");
  },
};
