import { z } from "zod";

export default z.object({
  parem: z.object({
    id: z
      .string({
        required_error: "An Exercise id is required.",
      })
      .min(1),
  }),
  body: z.object({
    node: z.string({
      invalid_type_error: "node must be a string.",
    }),
  }),
});
