import BaseException from "./BaseException";

/**
 * Exception class tailored to 404 User Not Found exceptions.
 *
 * Contains a default error message and sets the HTTP response status.
 */
export default class NotFoundException extends BaseException {
  constructor(message: string = "Not found") {
    super(message, 404);
  }
}
