import { preference } from "@prisma/client";

export {};

declare global {
  // Declaration of data types
  type user = {
    uid: string;
    iat: number;
  };
  type preferenceData = {
    preference: preference;
  };

  namespace Express {
    interface Request {
      user?: user;
    }
  }
}
