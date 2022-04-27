import { test } from "@japa/runner";
import { VirtualMachineService } from "../app/services/VirtualMachineService";
import { marked } from "marked";
import fs from "fs";

test.group("Virtual Machine Service", () => {
  test("parsing", ({ expect }) => {
    // const content = fs.readFileSync("exercises/102.md", 'utf8');
    // console.log(content);
    // const string = marked.lexer(content);
    // console.log(string);
    VirtualMachineService.getMetaData("102");
    // VirtualMachineService.cloneTemplate("102", "1000");
  });
});
