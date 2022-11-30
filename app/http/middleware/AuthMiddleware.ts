import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../services/AuthService";
import UnauthorizedException from "../../exceptions/UnauthorizedException";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
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

  // Validate if it starts with authorization token word
  if (!AuthService.validate(TOKEN)) {
    return next(new UnauthorizedException());
  }

  // Checks if there is more than one word in the authorization header
  if (TOKEN.split(" ").length < 2) {
    return next(new UnauthorizedException());
  }

  // Assign user information
  // Returns the error(JWTMalformedException) if the token retuns null
  try {
    req.user = AuthService.verifyToken(TOKEN.split(" ")[1]);
  } catch (e) {
    return next(e);
  }

  // Check if the user is logged in from the database
  try {
    const user = await prisma.users.findFirst({
      where: {
        uid: req.user.uid,
      },
    });

    // Check if user exists in the database
    if (user == null) {
      return next(new UnauthorizedException());
    }

    // User is not logged in
    if (user.token == "") {
      return next(new UnauthorizedException());
    }
  } catch (e) {
    return next(e);
  }

  // Go to the next middleware / controller
  return next();
}
