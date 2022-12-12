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
  // Gets the authorization, empty string if no value in authorization header
  const TOKEN: String = req.headers.authorization
    ? req.headers.authorization
    : "";

  // Checks if there is more than one word in the authorization header
  if (TOKEN.split(" ").length < 2) {
    console.log("No Bearer");
    return next(new UnauthorizedException());
  }

  // Assign user information
  // Returns the error(JWTMalformedException) if the token retuns null
  try {
    req.user = AuthService.verifyToken(TOKEN.split(" ")[1]);
  } catch (e) {
    console.log("Not verified");
    return next(e);
  }

  console.log(req.user?.uid + "\t\t AUTHMIDDLEWARE \t" + Date());
  // Go to the next middleware / controller
  return next();
}
