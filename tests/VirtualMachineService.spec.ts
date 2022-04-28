import { test } from "@japa/runner";
import { VirtualMachineService } from "../app/services/VirtualMachineService";
import { marked } from "marked";
import fs from "fs";

test.group("Virtual Machine Service", () => {
  test("parsing", ({ expect }) => {
    const string = VirtualMachineService.getMetaData("102");
    console.log(JSON.parse(string).title);
  });
});
