import { z } from "zod";
import { requiredText } from "@/features/schemas/required-text";

export const addStaffSchema = z.object({
  fullName: requiredText("Full name"),
  designation: requiredText("Designation"),
  assignedSchool: requiredText("Assigned school"),
  employmentType: requiredText("Employment type"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: requiredText("Phone number"),
});
