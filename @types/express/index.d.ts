import { VM } from ".prisma/client";

export {};

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
