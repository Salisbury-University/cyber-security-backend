import { z } from "zod";

export default z.object({
  body: z.object({
    preference: z.object({
      darkmode: z.boolean({
        required_error: "Boolean required",
      }),
    }),
  }),
});
