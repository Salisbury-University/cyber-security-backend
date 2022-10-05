import BaseException from "./BaseException";

/**
 * Exception class tailored to 409 request conflict
 *
 * Contains a default error message and sets the HTTP response status.
 */
export default class VirtualMachineConflitException extends BaseException {
  constructor(message: string = "Virtual Machine already running") {
    super(message, 409);
  }
}
