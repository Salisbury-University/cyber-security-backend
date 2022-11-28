import { preference, Users } from "@prisma/client";

export {};

declare global {
  // Declaration of data types
  type User = {
    uid: string;
    iat: number;
    exp: number;
  };

  type PreferenceData = {
    preference: preference;
  };

  type searchResult = {
    search: string;
    results: any;
  };

  type userData = {
    user: Users;
  };
}
