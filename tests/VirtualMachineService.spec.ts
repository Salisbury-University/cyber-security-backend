import { test } from "@japa/runner";
import { VirtualMachineService } from "../app/services/VirtualMachineService";
import { marked } from "marked";
import fs from "fs";

test.group("Virtual Machine Service", () => {
  // test("parsing", ({ expect }) => {
  //   const metadata = VirtualMachineService.getMetaData("102");
  //   const obj = { id: 1234, metadata, cd: 123 };
  //   console.log(metadata);
  //   console.log(JSON.parse(JSON.stringify(obj)));
  // }),
  test("clone", ({ expect }) => {
    VirtualMachineService.cloneTemplate("101", "1000");
  });
});
