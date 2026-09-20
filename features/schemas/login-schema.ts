import { z } from "zod";
import { requiredText } from "@/features/schemas/required-text";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: requiredText("Password"),
});
