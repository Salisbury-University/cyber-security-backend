import { z } from "zod";

export default z.object({
  // All params are string
  params: z.object({
    page: z
      .string({
        required_error: "A page number is required.",
      })
      .min(1),
  }),
});
