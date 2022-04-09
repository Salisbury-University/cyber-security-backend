import { z } from "zod";

export default z.object({
    body: z.object({
        username: z.string({
            required_error: "A Username is required.",
            invalid_type_error: "Username must be a string",
        }).min(1),
        password: z.string({
            required_error: "A Password is required.",
            invalid_type_error: "Password must be a string",
        }).min(1),
    })
});
