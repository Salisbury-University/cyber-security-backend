import { test } from "@japa/runner";
import { VirtualMachineService } from "../app/services/VirtualMachineService";
import { marked } from "marked";
import fs from "fs";
import { config } from "../config";

console.log(config.app.token);
test.group("Virtual Machine Service", () => {
  test("testing", async ({ expect }) => {
    // const testing = await VirtualMachineService.test();
    // const testing = await VirtualMachineService.migrateTemplate("105","cybernode1","cybernode2");
    const testing = await VirtualMachineService.cloneTemplate(
      "102",
      "cybernode1",
      "110"
    );
    console.log(testing);
    expect(testing).toBe(0);
  });

  // Passing clone
  // test("clone", ({ expect }) => {
  //   const vmid = "102";
  //   const newid = "1000";
  //   VirtualMachineService.cloneTemplate(vmid, newid);
  // });

  // Fail clone
  // test("clone fail", ({ expect }, done: Function) => {
  //   const vmid = "102";
  //   const newid = "1000";
  //   try {
  //     VirtualMachineService.cloneTemplate(vmid, newid);
  //   } catch (e) {
  //     expect(e).toBeInstanceOf;
  //   }
  // }).waitForDone();

  //
  // test("parsing", ({ expect }) => {
  //   const metadata = VirtualMachineService.getMetaData("102");
  //   const obj = { id: 1234, metadata, cd: 123 };
  //   console.log(metadata);
  // })
  // test("clone", ({ expect }) => {
  //   VirtualMachineService.cloneTemplate("101", "1000");
  // });

  // test("Check running", ({ expect }) => {
  //   VirtualMachineService.checkRunningVM("1111");
  // });
});
