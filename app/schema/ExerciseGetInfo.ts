import { z } from "zod";

export default z.object({
  params: z.object({
    id: z
      .string({
        required_error: "An Exercise id is required.",
      })
      .min(1),
  }),
});
