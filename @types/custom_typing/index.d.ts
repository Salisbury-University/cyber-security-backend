import { preference, Users } from "@prisma/client";

export {};

declare global {
  // Declaration of data types
  type User = {
    uid: string;
    iat: number;
  };

  type PreferenceData = {
    preference: preference;
  };

  type userData = {
    user: Users;
  };
}
