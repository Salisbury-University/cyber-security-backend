import BaseException from "./BaseException";

/**
 * Exception class tailored to 404 Not Found exceptions.
 *
 * Contains a default error message and sets the HTTP response status.
 */
export default class JwtMalformedException extends BaseException {
  constructor(message: string = "Not Found") {
    super(message, 404);
  }
}
