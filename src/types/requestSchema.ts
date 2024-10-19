// requestSchema.ts
import { z } from "zod";

export const requestSchema = z.object({
  auth: z
    .object({
      selected: z.enum(["bearer", "basic", "custom"]),
      bearer: z.string().optional(),
      basic: z
        .object({
          username: z.string().optional(),
          password: z.string().optional(),
        })
        .optional(),
      custom: z.string().optional(),
    })
    .optional(),
  headers: z.string(),
  method: z.enum(["GET", "HEAD", "POST", "PUT", "DELETE"]),
  url: z.string().url(),
  content: z
    .object({
      type: z.string(),
      content: z.string().optional(),
    })
    .optional(),
});
