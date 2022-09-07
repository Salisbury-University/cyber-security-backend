import BaseException from "./BaseException";

/**
 * Exception class tailored to 422 Invalid Credential exceptions.
 *
 * Contains a default error message and sets the HTTP response status.
 */
export default class InvalidCredentialException extends BaseException {
  constructor(message: string = "Invalid Credentials") {
    super(message, 422);
  }
}
