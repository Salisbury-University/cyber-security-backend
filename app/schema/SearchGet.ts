import { z } from "zod";

export default z.object({
  params: z.object({
    search: z
      .string({
        required_error: "A search param is required.",
      })
      .min(1),
  }),
});
