import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../services/AuthService";
import UnauthorizedException from "../../exceptions/UnauthorizedException";

/**
 * An example of authentication middleware to create authorized views / routes.
 *
 * @param req {Request} Express request object
 * @param res {Response} Express response object
 * @param next {NextFunction} Express next function
 */
export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Checks if there is at least two word in authorization header
  let token: String;
  try {
    token = req.headers.authorization.split(" ")[1];
  } catch (e) {
    return next(new UnauthorizedException());
  }

  // Checks if the authorization starts with Bearer
  if (!req.headers.authorization.startsWith("Bearer"))
    return next(new UnauthorizedException());

  // This doesn't do anything for now.
  // This will change to validate the token again LDAP later
  if (!AuthService.validate(token)) {
    return next(new UnauthorizedException());
  }

  // Assign user information
  // Returns the error if the token retuns null
  try {
    req.user = AuthService.decodeToken(token);
  } catch (e) {
    return next(e);
  }

  // Go to the next middleware / controller
  return next();
}
