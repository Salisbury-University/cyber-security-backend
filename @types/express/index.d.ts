export {};

import { VM } from "@prisma/client";

/**
 * {JSON} user: Holds the decoded jwtoken with user information
 */
declare global {
  namespace Express {
    interface Request {
      user?: JSON;
      VM?: VM;
    }
  }
}
