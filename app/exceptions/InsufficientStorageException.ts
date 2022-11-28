import BaseException from "./BaseException";

/**
 * Exception class tailored to 507 Insufficient Storage exceptions.
 *
 * Contains a default error message and sets the HTTP response status.
 */
export default class InsufficientStorageException extends BaseException {
  constructor(message: string = "Insufficient Storage") {
    super(message, 507);
  }
}
