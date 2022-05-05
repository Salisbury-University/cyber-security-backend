import jwt from "jsonwebtoken";
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
    const TOKEN_HEADER = "Bearer" + " ";
    if (token.startsWith(TOKEN_HEADER)) {
      return true;
    }
    return false;
  },
  /**
   * Decode the Jsonwebtoken
   *
   * @param {String} token Authorization token attached to the HTTP header
   * @return {user} Decoded jsonwebtoken
   * @throws {JwtMalformedException} Throws error when token is malformed or empty
   */
  decodeToken(token: String): user {
    const PAYLOAD: user = jwt.decode(token, { json: true });
    if (PAYLOAD === null) {
      throw new JwtMalformedException();
    }

    // IAT exists but ts kept giving error
    if (PAYLOAD.iat > Date.now()) {
      throw new JwtMalformedException();
    }

    return PAYLOAD;
  },
};
