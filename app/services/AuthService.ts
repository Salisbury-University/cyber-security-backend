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
   * @return {JSON} Decoded jsonwebtoken
   * @throws {JwtMalformedException} Throws error when token is malformed or empty
   */
  decodeToken(token: String): JSON {
    const PAYLOAD: any = jwt.decode(token, { json: true });

    // Check malformed Token
    if (PAYLOAD === null) {
      throw new JwtMalformedException();
    }

    // Check iat malform
    const CURRENT_TIME = Math.floor(Date.now() / 1000);
    if (PAYLOAD.iat > CURRENT_TIME) {
      throw new JwtMalformedException();
    }

    return PAYLOAD;
  },
};
