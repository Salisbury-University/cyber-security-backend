import BaseException from "./BaseException";

/**
 * Exception class tailored to 400 Jwt malformed exceptions.
 *
 * Contains a default error message and sets the HTTP response status.
 */
export default class JwtMalformedException extends BaseException {
  constructor(message: string = "JsonWebToken malformed") {
    super(message, 400);
  }
}
