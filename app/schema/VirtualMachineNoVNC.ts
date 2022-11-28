import { z } from "zod";

export default z.object({
  body: z.object({
    node: z
      .string({
        required_error: "A node is required.",
      })
      .min(1),
    vmid: z
      .string({
        required_error: "vmid is required.",
      })
      .min(1),
  }),
});
