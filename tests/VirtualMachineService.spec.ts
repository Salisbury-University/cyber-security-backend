import { test } from "@japa/runner";
import { VirtualMachineService } from "../app/services/VirtualMachineService";
import { marked } from "marked";
import fs from "fs";

test.group("Virtual Machine Service", () => {
  test("parsing", ({ expect }) => {
    const lex = marked.Lexer.lex;
    const string = VirtualMachineService.getMetaData("102");

    const pp = JSON.parse('{"title":"password"}');
    // const s = JSON.parse("{\"title\":\"How to parse markdown\",\"description\":\"I'm too sleepy for this\",\"author\":\"Christopher\",\"created\":04/11/2022 15:30:22,\"updated\":04/11/2022 15:31:00,\"vm\":102,\"hidden\":false,\"timelimit\":\"4h\",\"difficulty\":2,\"categories\":[\"sql\", \"tcp\", \"attack on titan\"}");
    console.log(JSON.parse(string));
    console.log(pp.title);
    console.log(Date.parse("04/11/2022 15:30:22"));
  });
});
