import { test } from "@japa/runner";
import { VirtualMachineService } from "../app/services/VirtualMachineService";
import { marked } from "marked";
import fs from "fs";

test.group("Virtual Machine Service", () => {
  test("parsing", ({ expect }) => {
    const content = fs.readFile("exercises/102.md");
    const string = marked.lexer("/exercises/");
  });
});
