import { preference, VM } from "@prisma/client";

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

  type VirtualMachineData = {
    VM: VM;
  };
}
