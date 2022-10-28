import { test } from "@japa/runner";
import { config } from "../config";

console.log(config.app.token);
test.group("Virtual Machine Service", () => {
  // Since everything is dynamically allocated, not sure how to create unit test
});
