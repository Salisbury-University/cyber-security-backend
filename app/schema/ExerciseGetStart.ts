import { z } from "zod";

export default z.object({
  body: z.object({
    node: z.string({
      invalid_type_error: "node must be a string.",
    }),
  }),
});
