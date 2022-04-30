import { test } from "@japa/runner";
import { VirtualMachineService } from "../app/services/VirtualMachineService";
import { marked } from "marked";
import fs from "fs";

test.group("Virtual Machine Service", () => {
  // Passing clone
  test("clone", ({ expect }) => {
    const vmid = "102";
    const newid = "1000";
    VirtualMachineService.cloneTemplate(vmid, newid);
  });

  // Fail clone
  test("clone fail", ({ expect }, done: Function) => {
    const vmid = "102";
    const newid = "1000";
    try {
      VirtualMachineService.cloneTemplate(vmid, newid);
    } catch (e) {
      expect(e).toBeInstanceOf;
    }
  }).waitForDone();

  //
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
