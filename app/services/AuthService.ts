import axios from "axios";
import InvalidCredentialException from "../exceptions/InvalidCredentials";
import { config } from "../../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import JwtMalformedException from "../exceptions/JwtMalformedException";

/**
 * All of the functions regarding authorization
 */
export const AuthService = {
  /**
   * Checks if the token starts with Bearer(JWT token) and a spcae afterward
   *
   * @param {String} token Authorization token attached to the HTTP header.
   * @return {boolean} True if their token is valid, false if it isn't.
   */
  validate(token: String): boolean {
    // Space for to check for two words
    const tokenHeader = "Bearer" + " ";
    if (token.startsWith(tokenHeader)) {
      return true;
    }
    return false;
  },

  /**
   *  Verifiy token that returns decoded token
   *
   * @param {String} token Jwt token that was created during login
   * @returns {User} decoded token
   */
  verifyToken(token: String): User {
    try {
      const verified = jwt.verify(token, config.app.secret);
      return verified;
    } catch (e) {
      throw new JwtMalformedException();
    }
  },
};
