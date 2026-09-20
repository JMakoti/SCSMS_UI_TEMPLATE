import { z } from "zod";
import { requiredText } from "@/features/schemas/required-text";

export const addContactSchema = z.object({
  school: requiredText("School"),
  role: requiredText("Contact role"),
  fullName: requiredText("Full name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: requiredText("Phone number"),
  status: z.string().trim().optional(),
});
