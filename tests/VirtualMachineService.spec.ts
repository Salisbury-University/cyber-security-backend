import { test } from "@japa/runner";
import { VirtualMachineService } from "../app/services/VirtualMachineService";
import { marked } from "marked";
import fs from "fs";
import { config } from "../config";

console.log(config.app.token);
test.group("Virtual Machine Service", () => {
  // Since everything is dynamically allocated, not sure how to create unit test
});
